'use client'
export const validateCNPJ = (cnpj: string): boolean => {
	cnpj = cnpj.replace(/[^\d]+/g, '')

	if (cnpj.length !== 14) return false

	// Verificar se todos os dígitos são iguais (CNPJs inválidos)
	if (/^(\d)\1{13}$/.test(cnpj)) return false

	const calculateDigit = (cnpj: string, initWeight: number) => {
		let sum = 0
		let weight = initWeight

		for (let i = 0; i < cnpj.length; i++) {
			sum += parseInt(cnpj[i]) * weight
			weight = weight === 2 ? 9 : weight - 1
		}

		const rest = sum % 11
		return rest < 2 ? 0 : 11 - rest
	}

	const firstDigit = calculateDigit(cnpj.substring(0, 12), 5)

	const secondDigit = calculateDigit(cnpj.substring(0, 12) + firstDigit, 6)

	return cnpj.endsWith(`${firstDigit}${secondDigit}`)
}


