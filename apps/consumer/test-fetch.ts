async function test() {
    console.log('Testing connectivity to API...');
    try {
        const res = await fetch('http://127.0.0.1:3001/public/menu/c02dc8bc-112e-4def-9a71-dcf4950ed7bf/config');
        console.log('Status:', res.status);
        const data = await res.json();
        console.log('Data received:', !!data);
    } catch (e: any) {
        console.error('Fetch failed:', e.message);
    }
}

test();
