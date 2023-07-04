const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * @typedef {Object} Alternative
 * @property {string} description - A descrição da alternativa.
 * @property {boolean} correct - Indica se a alternativa é a correta ou não.
 */

/**
 * @typedef {Object} Question
 * @property {string} term - Termo.
 * @property {Array<Alternative>} alternatives - Um array de objetos representando as alternativas.
 */

/**
 * Gera uma pergunta de múltipla escolha com três alternativas incorretas em português, com base em um assunto, termo e sua definição correta.
 * @param {string} subject - O assunto da pergunta.
 * @param {string} term - O termo da pergunta.
 * @param {string} correctDefinition - A definição correta do termo.
 * @returns {Question}
 */
async function generateQuestion(subject, term, correctDefinition) {

    const getAlternatives = async (subject, term, correctDefinition, attempt = 1) => {
        if(attempt >= 3) {
            return [];
        }

        try {
            const prompt = [
                "Generate four incorrect alternatives in Portuguese for a multiple-choice question based on a subject, term, and its correct definition.",
                `Subject: ${subject}`,
                `Term: ${term}`,
                `Correct Definition: ${correctDefinition}`,
                "Alternative 1 (Portuguese): [insert incorrect alternative definition in Portuguese here]",
                "Alternative 2 (Portuguese): [insert incorrect alternative definition in Portuguese here]",
                "Alternative 3 (Portuguese): [insert incorrect alternative definition in Portuguese here]",
                "Alternative 4 (Portuguese): [insert incorrect alternative definition in Portuguese here]"
            ].join('\n');
        
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                temperature: 1,
                max_tokens: 450,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
        
            const textResponse = response.data.choices[0].text.trim();
        
            const alternatives = [{
                description: correctDefinition,
                correct: true
            }];
        
            const lines = textResponse.split("\n");
        
            lines.forEach(line => {
                if(alternatives.length === 5) {
                    return;
                }
        
                const description = ((line.split("(Portuguese): "))[1]).trim();
        
                alternatives.push({
                    description: description,
                    correct: false
                })
            });

            return alternatives;
        }
        catch {
            return getAlternatives(subject, term, correctDefinition, (attempt + 1));
        }
    }

    return {
        term,
        alternatives: await getAlternatives(subject, term, correctDefinition)
    };
}

module.exports = generateQuestion;