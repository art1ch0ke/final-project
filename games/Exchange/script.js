let base = 'KZT',
    rates = {};
const accessKey = 'e8a93a0d046d9a215cb63e8a23a4823f', 
      symbols = 'RUB,KZT,USD,EUR,UAH,PLN';

async function getRates(base) {
    const responce = 
    await fetch(`https://api.exchangerate.host/live?access_key=${accessKey}&currencies=${symbols}&source=${base}`);
    const data = await responce.json();
    return await data.quotes;
}

const inputs = document.querySelectorAll('input');
inputs.forEach((row)=>{
    row.addEventListener('input', async (e)=>{
        base = e.target.id.toUpperCase();
        const value = parseFloat(e.target.value);
        if (isNaN(value)) return;
        const spinner = document.createElement('img');
        spinner.src = '../Weather-app/img/spinner.svg';
        spinner.style.cssText = `display: block; position: absolute; top: 14%; left: 47%;`;
        const box = document.getElementById('spinner');
        box.innerHTML = '';
        box.appendChild(spinner);
        rates = await getRates(base);
        
        inputs.forEach((otherInput)=>{
            if (otherInput.id.toUpperCase() === base) return;
            const targetCurrency = base + otherInput.id.toUpperCase();
            otherInput.value = (value * rates[targetCurrency]).toFixed(2);
        });
        box.innerHTML = '';
    });
});
