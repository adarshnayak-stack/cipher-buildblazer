import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { pool, query } from './db.js';
import { verifyAdmin, changeAdminPassword, signAdminToken, requireAdmin } from './auth.js';
import { eventSchema, memberSchema, joinSchema, parsed } from './validation.js';
import { seed, syncMediaPaths } from './seed.js';

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',').map(x=>x.trim()) || true, credentials: false }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));

const authLimiter = rateLimit({ windowMs: 15*60*1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const publicLimiter = rateLimit({ windowMs: 15*60*1000, limit: 100, standardHeaders: true, legacyHeaders: false });

const api = express.Router();
api.use(publicLimiter);

const publicUrl = (req, filename) => `${(process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '')}/uploads/${filename}`;

async function getContent() {
  const [site, events, team] = await Promise.all([
    query('SELECT content FROM site_content WHERE id=1'),
    query(`SELECT id,title,slug,category,status,to_char(date,'YYYY-MM-DD') AS date,time,location,short_description AS "shortDescription",full_description AS "fullDescription",image,gallery_images AS "galleryImages",registration_link AS "registrationLink" FROM events ORDER BY sort_order,id`),
    query(`SELECT id,group_name AS "group",name,role,designation,department,year,image,linkedin,github,bio FROM team_members ORDER BY group_name,sort_order,id`)
  ]);
  const t={faculty:[],officeBearers:[],coreTeam:[]};
  for(const m of team.rows) (t[m.group] ||= []).push(m);
  return { site: site.rows[0]?.content || {}, events: events.rows, team:t };
}

api.get('/health', async (_,res)=>res.json({ok:true}));
api.get('/content', async (_,res)=>res.json(await getContent()));

api.post('/auth/login', authLimiter, async (req,res,next)=>{
  try { const id=await verifyAdmin(req.body.password); if(!id) return res.status(401).json({error:'Invalid admin password.'}); res.json({token:signAdminToken(id)}); } catch(e){ next(e); }
});
api.get('/auth/me', requireAdmin, (_,res)=>res.json({ok:true,role:'admin'}));
api.post('/auth/change-password', requireAdmin, async (req,res,next)=>{
  try {
    const { currentPassword, newPassword } = req.body || {};
    if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({error:'Current password and a new password of at least 8 characters are required.'});
    if (currentPassword === newPassword) return res.status(400).json({error:'New password must be different from the current password.'});
    const result = await changeAdminPassword(currentPassword, newPassword);
    if (!result.ok) return res.status(401).json({error:result.reason});
    res.json({ok:true});
  } catch(e){ next(e); }
});

api.put('/content', requireAdmin, async (req,res,next)=>{
  const client = await pool.connect();
  try {
    const body = req.body || {};
    const site = body.site || body;
    await client.query('BEGIN');
    await client.query('UPDATE site_content SET content=$1,updated_at=NOW() WHERE id=1',[JSON.stringify(site)]);
    if (Array.isArray(body.events)) {
      await client.query('DELETE FROM events');
      for (let i=0;i<body.events.length;i++) {
        const e=parsed(eventSchema,body.events[i]);
        await client.query(`INSERT INTO events(id,title,slug,category,status,date,time,location,short_description,full_description,image,gallery_images,registration_link,sort_order)
          VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
          [e.id,e.title,e.slug,e.category,e.status,e.date||null,e.time||null,e.location||'',e.shortDescription,e.fullDescription,e.image,JSON.stringify(e.galleryImages),e.registrationLink,i]);
      }
    }
    if (body.team) {
      await client.query('DELETE FROM team_members');
      for (const group of ['faculty','officeBearers','coreTeam']) {
        const list=Array.isArray(body.team[group])?body.team[group]:[];
        for(let i=0;i<list.length;i++){
          const m=parsed(memberSchema,{...list[i],group});
          await client.query(`INSERT INTO team_members(id,group_name,name,role,designation,department,year,image,linkedin,github,bio,sort_order)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
            [m.id,m.group,m.name,m.role,m.designation,m.department,m.year,m.image,m.linkedin,m.github,m.bio,i]);
        }
      }
    }
    await client.query('COMMIT');
    res.json(await getContent());
  } catch(e) { await client.query('ROLLBACK'); next(e); }
  finally { client.release(); }
});

api.get('/events', async (_,res)=>res.json((await getContent()).events));
api.post('/events', requireAdmin, async (req,res,next)=>{
  try { const e=parsed(eventSchema,req.body); const r=await query(`INSERT INTO events(id,title,slug,category,status,date,time,location,short_description,full_description,image,gallery_images,registration_link,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,(SELECT COALESCE(MAX(sort_order),-1)+1 FROM events)) RETURNING *`,[e.id,e.title,e.slug,e.category,e.status,e.date||null,e.time||null,e.location||'',e.shortDescription,e.fullDescription,e.image,JSON.stringify(e.galleryImages),e.registrationLink]); res.status(201).json(e); } catch(e){next(e);}
});
api.put('/events/:id', requireAdmin, async (req,res,next)=>{
  try { const e=parsed(eventSchema,{...req.body,id:req.params.id}); await query(`UPDATE events SET title=$1,slug=$2,category=$3,status=$4,date=$5,time=$6,location=$7,short_description=$8,full_description=$9,image=$10,gallery_images=$11,registration_link=$12,updated_at=NOW() WHERE id=$13`,[e.title,e.slug,e.category,e.status,e.date||null,e.time||null,e.location||'',e.shortDescription,e.fullDescription,e.image,JSON.stringify(e.galleryImages),e.registrationLink,e.id]); res.json(e); } catch(e){next(e);}
});
api.delete('/events/:id', requireAdmin, async (req,res,next)=>{try{await query('DELETE FROM events WHERE id=$1',[req.params.id]);res.status(204).end();}catch(e){next(e);}});

api.get('/team', async (_,res)=>res.json((await getContent()).team));
api.post('/team', requireAdmin, async (req,res,next)=>{
  try { const m=parsed(memberSchema,req.body); const r=await query(`INSERT INTO team_members(id,group_name,name,role,designation,department,year,image,linkedin,github,bio,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,(SELECT COALESCE(MAX(sort_order),-1)+1 FROM team_members WHERE group_name=$2)) RETURNING id`,[m.id,m.group,m.name,m.role,m.designation,m.department,m.year,m.image,m.linkedin,m.github,m.bio]); res.status(201).json(m); } catch(e){next(e);}
});
api.put('/team/:id', requireAdmin, async (req,res,next)=>{
  try { const m=parsed(memberSchema,{...req.body,id:req.params.id}); await query(`UPDATE team_members SET group_name=$1,name=$2,role=$3,designation=$4,department=$5,year=$6,image=$7,linkedin=$8,github=$9,bio=$10,updated_at=NOW() WHERE id=$11`,[m.group,m.name,m.role,m.designation,m.department,m.year,m.image,m.linkedin,m.github,m.bio,m.id]); res.json(m); } catch(e){next(e);}
});
api.delete('/team/:id', requireAdmin, async (req,res,next)=>{try{await query('DELETE FROM team_members WHERE id=$1',[req.params.id]);res.status(204).end();}catch(e){next(e);}});

api.get('/join-requests', requireAdmin, async (_,res,next)=>{try{const r=await query(`SELECT id,name,email,usn,year,department,message,status,created_at AS "createdAt" FROM join_requests ORDER BY created_at DESC`);res.json(r.rows);}catch(e){next(e);}});
api.post('/join-requests', async (req,res,next)=>{
  try { const j=parsed(joinSchema,req.body); const id=`jr-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`; const r=await query(`INSERT INTO join_requests(id,name,email,usn,year,department,message) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id,name,email,usn,year,department,message,status,created_at AS "createdAt"`,[id,j.name,j.email,j.usn.toUpperCase(),j.year,j.department,j.message]); res.status(201).json(r.rows[0]); } catch(e){next(e);}
});
api.patch('/join-requests/:id/status', requireAdmin, async (req,res,next)=>{try{if(!['new','read'].includes(req.body.status)) return res.status(400).json({error:'Invalid status'}); const r=await query(`UPDATE join_requests SET status=$1 WHERE id=$2 RETURNING id,status`,[req.body.status,req.params.id]); if(!r.rowCount) return res.status(404).json({error:'Request not found'});res.json(r.rows[0]);}catch(e){next(e);}});
api.delete('/join-requests/:id', requireAdmin, async (req,res,next)=>{try{await query('DELETE FROM join_requests WHERE id=$1',[req.params.id]);res.status(204).end();}catch(e){next(e);}});
api.post('/join-requests/mark-all-read', requireAdmin, async (_,res,next)=>{try{await query(`UPDATE join_requests SET status='read' WHERE status='new'`);res.status(204).end();}catch(e){next(e);}});

const storage = multer.diskStorage({
  destination: (_,__,cb)=>cb(null,uploadDir),
  filename: (_,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(6).toString('hex')}${path.extname(file.originalname).toLowerCase()}`)
});
const maxBytes=(Number(process.env.MAX_UPLOAD_MB)||100)*1024*1024;
const upload=multer({storage,limits:{fileSize:maxBytes},fileFilter:(_,file,cb)=>cb(null,/^(image|video)\//.test(file.mimetype))});

api.post('/uploads/image', requireAdmin, upload.single('file'), async (req,res,next)=>{try{if(!req.file)return res.status(400).json({error:'Image file required.'}); const r=await query(`INSERT INTO media(kind,original_name,filename,mime_type,size_bytes) VALUES('image',$1,$2,$3,$4) RETURNING id`,[req.file.originalname,req.file.filename,req.file.mimetype,req.file.size]);res.status(201).json({id:r.rows[0].id,url:publicUrl(req,req.file.filename),name:req.file.originalname,size:req.file.size});}catch(e){next(e);}});
api.post('/uploads/video', requireAdmin, upload.single('file'), async (req,res,next)=>{try{if(!req.file)return res.status(400).json({error:'Video file required.'}); const r=await query(`INSERT INTO media(kind,original_name,filename,mime_type,size_bytes) VALUES('video',$1,$2,$3,$4) RETURNING id`,[req.file.originalname,req.file.filename,req.file.mimetype,req.file.size]);res.status(201).json({id:r.rows[0].id,url:publicUrl(req,req.file.filename),name:req.file.originalname,size:req.file.size});}catch(e){next(e);}});
api.get('/uploads/:id', requireAdmin, async (req,res,next)=>{try{const r=await query('SELECT filename FROM media WHERE id=$1',[req.params.id]);if(!r.rowCount)return res.status(404).end();res.sendFile(path.join(uploadDir,r.rows[0].filename));}catch(e){next(e);}});

app.use('/api',api);
app.use((err,req,res,_)=>{console.error(err);const status=err.status|| (err.code==='23505'?409:500);res.status(status).json({error:status===500?'Internal server error.':err.message});});

const port=Number(process.env.PORT)||5000;
await query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
await query(fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8"));
await seed();
await syncMediaPaths();
app.listen(port,()=>console.log(`CIPHER backend running on http://localhost:${port}`));
process.on('SIGINT',async()=>{await pool.end();process.exit(0)});
