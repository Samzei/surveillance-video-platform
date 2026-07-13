import { useAccessibility } from "../context/AccessibilityContext";

function AccessibilityControls() {
    const {
        textSize,
        setTextSize,
        highContrast,
        setHighContrast,
    } = useAccessibility();

    return (
        <section
            className="accessibility-controls"
            aria-labelledby="accessibility-heading"
        >
            <h2 id="accessibility-heading">Accessibility</h2>

            <label htmlFor="text-sizee">Text size</label>

            <select
                id="text-size"
                value={textSize}
                onChange={(event) => setTextSize(event.target.value)}
            >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra large</option>
            </select>

            <label className="contrast-option">
                <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(event) => setHighContrast(event.target.checked)}
                />
                Enable high-contrast mode
            </label>
        </section>
    );
}

export default AccessibilityControls