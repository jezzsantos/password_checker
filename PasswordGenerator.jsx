const { useState, useEffect, useCallback } = React;

function PasswordGenerator() {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(12);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true
    });
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState('');
    const [strengthScore, setStrengthScore] = useState(0);

    const strengthColors = {
        'Very Weak': '#d32f2f',
        'Weak': '#f57c00',
        'Medium': '#fbc02d',
        'Strong': '#689f38',
        'Very Strong': '#388e3c'
    };

    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{};\':"|,.<>?/\\`~'
    };

    const generatePassword = useCallback(() => {
        let availableChars = '';
        let generatedPassword = '';

        // Build character set based on selected options
        if (options.uppercase) availableChars += charSets.uppercase;
        if (options.lowercase) availableChars += charSets.lowercase;
        if (options.numbers) availableChars += charSets.numbers;
        if (options.special) availableChars += charSets.special;

        // If no options selected, use all character types
        if (availableChars === '') {
            availableChars = charSets.uppercase + charSets.lowercase + charSets.numbers + charSets.special;
        }

        // Generate password
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * availableChars.length);
            generatedPassword += availableChars[randomIndex];
        }

        setPassword(generatedPassword);
        setCopied(false);
    }, [options, length]);

    const copyToClipboard = async () => {
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleOptionChange = (option) => {
        setOptions(prev => ({
            ...prev,
            [option]: !prev[option]
        }));
    };

    const checkPasswordStrength = (pwd) => {
        if (!pwd) return { strength: '', score: 0 };

        let score = 0;

        // Check length
        if (pwd.length >= 8) score += 20;
        if (pwd.length >= 12) score += 10;
        if (pwd.length >= 16) score += 10;

        // Check for uppercase
        if (/[A-Z]/.test(pwd)) score += 15;

        // Check for lowercase
        if (/[a-z]/.test(pwd)) score += 15;

        // Check for numbers
        if (/\d/.test(pwd)) score += 15;

        // Check for special characters
        if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(pwd)) score += 15;

        // Determine strength level
        let strengthLevel;
        if (score < 30) {
            strengthLevel = 'Very Weak';
        } else if (score < 50) {
            strengthLevel = 'Weak';
        } else if (score < 70) {
            strengthLevel = 'Medium';
        } else if (score < 85) {
            strengthLevel = 'Strong';
        } else {
            strengthLevel = 'Very Strong';
        }

        return { strength: strengthLevel, score };
    };

    useEffect(() => {
        if (password) {
            const result = checkPasswordStrength(password);
            setStrength(result.strength);
            setStrengthScore(result.score);
        }
    }, [password]);

    // Generate initial password on mount
    useEffect(() => {
        generatePassword();
    }, []);

    // Auto-regenerate password when length or options change
    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    const editCharacter = useCallback((index) => {
        let availableChars = '';
        if (options.uppercase) availableChars += charSets.uppercase;
        if (options.lowercase) availableChars += charSets.lowercase;
        if (options.numbers) availableChars += charSets.numbers;
        if (options.special) availableChars += charSets.special;

        if (availableChars === '') {
            availableChars = charSets.uppercase + charSets.lowercase + charSets.numbers + charSets.special;
        }

        const randomIndex = Math.floor(Math.random() * availableChars.length);
        const newChar = availableChars[randomIndex];
        const newPassword = password.substring(0, index) + newChar + password.substring(index + 1);
        setPassword(newPassword);
    }, [options, password]);

    return (
        <div className="card">
            <h2 className="title">Password Generator</h2>

                {/* Generated Password Display */}
                <div className="password-display">
                    <div className="generated-password">
                        {password ? (
                            password.split('').map((char, index) => (
                                <span
                                    key={index}
                                    className="password-char"
                                    onClick={() => editCharacter(index)}
                                    title="Click to change this character"
                                >
                                    {char}
                                </span>
                            ))
                        ) : (
                            <span className="password-placeholder">Click generate to create password</span>
                        )}
                    </div>
                    <button
                        onClick={copyToClipboard}
                        className="copy-button"
                        title="Copy to clipboard"
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>

                {copied && <div className="copy-message">Copied to clipboard!</div>}

                {/* Password Strength Display */}
                {password && (
                    <div className="strength-section">
                        <div className="strength-header">
                            <span className="strength-text">Strength:</span>
                            <span 
                                className="strength-value"
                                style={{ color: strengthColors[strength] }}
                            >
                                {strength}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill"
                                style={{ 
                                    width: `${strengthScore}%`,
                                    backgroundColor: strengthColors[strength]
                                }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Length Slider */}
                <div className="length-section">
                    <label className="length-label">
                        Password Length: <strong>{length}</strong>
                    </label>
                    <input
                        type="range"
                        min="4"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="length-slider"
                    />
                    <div className="length-markers">
                        <span>4</span>
                        <span>32</span>
                    </div>
                </div>

                {/* Character Options */}
                <div className="options-section">
                    <h3 className="options-title">Include Characters:</h3>
                    <div className="options-grid">
                        <label className="toggle-option">
                            <span className="toggle-label">Uppercase (A-Z)</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={options.uppercase}
                                    onChange={() => handleOptionChange('uppercase')}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                        <label className="toggle-option">
                            <span className="toggle-label">Lowercase (a-z)</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={options.lowercase}
                                    onChange={() => handleOptionChange('lowercase')}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                        <label className="toggle-option">
                            <span className="toggle-label">Numbers (0-9)</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={options.numbers}
                                    onChange={() => handleOptionChange('numbers')}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                        <label className="toggle-option">
                            <span className="toggle-label">Special (!@#$%)</span>
                            <div className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={options.special}
                                    onChange={() => handleOptionChange('special')}
                                />
                                <span className="toggle-slider"></span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Generate Button */}
                <button onClick={generatePassword} className="generate-button">
                    Generate Password
                </button>
        </div>
    );
}
