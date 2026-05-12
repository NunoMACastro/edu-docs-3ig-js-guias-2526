/**
 * Mostra a vida atual do boss em percentagem.
 * @param {object} props - Props do componente.
 * @param {number} props.health - Vida atual do boss entre 0 e 100.
 * @returns {JSX.Element} Barra de vida do boss.
 */
function BossHealthBar({ health }) {
    return (
        <div className="boss-health">
            <div className="boss-health__header">
                <strong>Vida do boss</strong>
                <span>{health}%</span>
            </div>

            <div className="boss-health__bar">
                <div
                    className="boss-health__fill"
                    style={{ width: `${health}%` }}
                />
            </div>
        </div>
    );
}

export default BossHealthBar;
