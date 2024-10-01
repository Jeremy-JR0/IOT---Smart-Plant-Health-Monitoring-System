const scientificName = "Hydrangea spp.";

fetch('http://localhost:3001/send-to-raspberry', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ scientificName }),
})
.then(response => response.json())
.then(data => console.log(data))
.catch((error) => {
    console.error('Error:', error);
});
