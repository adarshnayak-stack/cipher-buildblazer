import { eventsData } from '../src/data/events.js';
import { teamData } from '../src/data/team.js';
import { siteContent } from '../src/data/siteContent.js';
import { query } from './db.js';

export async function seed() {
  const site = await query('SELECT id FROM site_content WHERE id=1');
  if (!site.rowCount) await query('INSERT INTO site_content(id,content) VALUES(1,$1)', [JSON.stringify(siteContent)]);

  const evCount = await query('SELECT COUNT(*)::int AS count FROM events');
  if (evCount.rows[0].count === 0) {
    for (let i=0;i<eventsData.length;i++) {
      const e=eventsData[i];
      await query(`INSERT INTO events(id,title,slug,category,status,date,time,location,short_description,full_description,image,gallery_images,registration_link,sort_order)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,[
        e.id,e.title,e.slug,e.category,e.status,e.date||null,e.time||null,e.location||null,e.shortDescription||'',e.fullDescription||'',e.image||'',JSON.stringify(e.galleryImages||[]),e.registrationLink||'',i
      ]);
    }
  }

  const teamCount = await query('SELECT COUNT(*)::int AS count FROM team_members');
  if (teamCount.rows[0].count === 0) {
    const groups=[['faculty',teamData.faculty||[]],['officeBearers',teamData.officeBearers||[]],['coreTeam',teamData.coreTeam||[]]];
    for (const [group,list] of groups) for(let i=0;i<list.length;i++){
      const m=list[i];
      await query(`INSERT INTO team_members(id,group_name,name,role,designation,department,year,image,linkedin,github,bio,sort_order)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,[
        m.id,group,m.name,m.role||'',m.designation||'',m.department||'',m.year||'',m.image||'',m.linkedin||'',m.github||'',m.bio||'',i
      ]);
    }
  }
}


export async function syncMediaPaths() {
  const updates = [
    ['e1', '/images/events/event-placeholder.svg', JSON.stringify(['/images/events/event-placeholder.svg'])],
    ['e2', '/images/events/20260325_141046.jpg', JSON.stringify([
      '/images/events/20260325_141046.jpg',
      '/images/events/20260325_165226.jpg',
      '/images/events/20260325_165255.jpg',
      '/images/events/20260325_165327(0).jpg',
      '/images/events/IMG_8888.JPG',
      '/images/events/IMG_8912.JPG'
    ])],
    ['e3', '/images/events/event-placeholder.svg', JSON.stringify(['/images/events/event-placeholder.svg'])]
  ];
  for (const [id, image, gallery] of updates) {
    await query('UPDATE events SET image=$1,gallery_images=$2,updated_at=NOW() WHERE id=$3', [image, gallery, id]);
  }

  const teamImages = {
    t1: '/images/team/Screenshot 2026-09-20 163844.png',
    t2: '/images/team/Screenshot 2026-09-20 163853.png',
    t3: '/images/team/Screenshot 2026-09-20 163910.png',
    t4: '/images/team/Screenshot 2026-09-20 163916.png',
    c1: '/images/team/team-placeholder.svg',
    c2: '/images/team/team-placeholder.svg',
    f1: '/images/team/team-placeholder.svg'
  };
  for (const [id, image] of Object.entries(teamImages)) {
    await query('UPDATE team_members SET image=$1,updated_at=NOW() WHERE id=$2', [image, id]);
  }
}
