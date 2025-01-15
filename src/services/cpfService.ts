'use client'
export const validateCPF = (cpf: string): boolean =>{

    const cleanCPF = cpf.replace(/\D/g, "");

    //verificando se contem 11 digitos 

     if(cleanCPF.length != 11){
        return false
     }

     // verificando se todos os digitos são iguais

     if (/^(\d)\1+$/.test(cleanCPF)) {
        return false;
    }

    const calculateCheckDigit = (cpfArray: number[], length: number): number => {
        const sum = cpfArray
            .slice(0, length)
            .reduce((acc, num, index) => acc + num * (length + 1 - index), 0);
        const result = (sum * 10) % 11;
        return result === 10 ? 0 : result;
    };

    const digits = cleanCPF.split("").map(Number);
    const firstCheckDigit = calculateCheckDigit(digits, 9);
    const secondCheckDigit = calculateCheckDigit(digits, 10);

    return (
        firstCheckDigit === digits[9] && secondCheckDigit === digits[10]
    );
}