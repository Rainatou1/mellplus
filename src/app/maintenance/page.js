export default function MaintenancePage() {
return (
<div style={{
display: 'flex', flexDirection: 'column',
alignItems: 'center', justifyContent: 'center',
minHeight: '100vh', fontFamily: 'sans-serif',
background: '#191970', textAlign: 'center', padding: '2rem'
}}>
<h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</h1>
<h2 style={{ fontSize: '2.8rem', color: '#ffffff' }}>Site en maintenance</h2>
<p style={{ color: '#ffffff', maxWidth: '600px', marginTop: '2rem' }}>
Nous effectuons des améliorations. Nous serons de retour très bientôt !
</p>
</div>
);
}
 