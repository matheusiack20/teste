async function createClient(data) {
    const apiUrl = 'https://api.example.com/create-client'; // Verifique se esta URL está correta

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }
}

// Example usage of createClient function
createClient({ name: 'John Doe', email: 'john.doe@example.com' })
    .then(result => console.log('Client created successfully:', result))
    .catch(error => console.error('Error creating client:', error));

// ...existing code...
