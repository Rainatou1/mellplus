export default function MaintenancePage() {
return (
<div style={{
display: 'flex', flexDirection: 'column',
alignItems: 'center', justifyContent: 'center',
minHeight: '100vh', fontFamily: 'sans-serif',
background: '#f8f9fa', textAlign: 'center', padding: '2rem'
}}>
<h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</h1>
<h2 style={{ fontSize: '1.8rem', color: '#333' }}>Site en maintenance</h2>
<p style={{ color: '#666', maxWidth: '400px', marginTop: '1rem' }}>
Nous effectuons des améliorations. Nous serons de retour très bientôt !
</p>
</div>
);
}
 