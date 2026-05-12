/**
 * Mostra uma medalha simples conforme a percentagem final.
 * @param {object} props - Props do componente.
 * @param {object} props.stats - Estatísticas finais.
 * @param {object | null} props.bestScore - Melhor pontuação guardada.
 * @returns {JSX.Element}
 */
function ScoreBadge({ stats, bestScore }) {
    const isNewBestScore = !bestScore || stats.score >= bestScore.score;

    let medal = "Medalha de participação";
    let badgeClass = "score-badge score-badge--basic";

    if (stats.percentage >= 90) {
        medal = "Medalha de ouro";
        badgeClass = "score-badge score-badge--gold";
    } else if (stats.percentage >= 70) {
        medal = "Medalha de prata";
        badgeClass = "score-badge score-badge--silver";
    } else if (stats.percentage >= 50) {
        medal = "Medalha de bronze";
        badgeClass = "score-badge score-badge--bronze";
    }

    return (
        <div className={badgeClass}>
            <strong>{medal}</strong>
            <span>{isNewBestScore ? "Nova melhor pontuação" : "Bom esforço"}</span>
        </div>
    );
}

export default ScoreBadge;

