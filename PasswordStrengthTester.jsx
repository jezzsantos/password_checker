const { useState, useEffect } = React;

function PasswordStrengthTester() {
    const [mode, setMode] = useState('single'); // 'single' or 'bulk'
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState('Very Weak');
    const [score, setScore] = useState(0);
    const [criteriaMet, setCriteriaMet] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Bulk testing state
    const [bulkPasswords, setBulkPasswords] = useState([{ id: 1, value: '' }]);
    const [bulkResults, setBulkResults] = useState(null);

    const strengthColors = {
        'Very Weak': '#d32f2f',
        'Weak': '#f57c00',
        'Medium': '#fbc02d',
        'Strong': '#689f38',
        'Very Strong': '#388e3c'
    };

    const checkPasswordStrength = (pwd) => {
        let calculatedScore = 0;
        const newCriteriaMet = {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false
        };

        if (pwd.length === 0) {
            return { strength: 'Very Weak', score: 0, criteriaMet: newCriteriaMet };
        }

        // Check length
        if (pwd.length >= 8) {
            calculatedScore += 20;
            newCriteriaMet.length = true;
        }
        if (pwd.length >= 12) {
            calculatedScore += 10;
        }
        if (pwd.length >= 16) {
            calculatedScore += 10;
        }

        // Check for uppercase
        if (/[A-Z]/.test(pwd)) {
            calculatedScore += 15;
            newCriteriaMet.uppercase = true;
        }

        // Check for lowercase
        if (/[a-z]/.test(pwd)) {
            calculatedScore += 15;
            newCriteriaMet.lowercase = true;
        }

        // Check for numbers
        if (/\d/.test(pwd)) {
            calculatedScore += 15;
            newCriteriaMet.number = true;
        }

        // Check for special characters
        if (/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(pwd)) {
            calculatedScore += 15;
            newCriteriaMet.special = true;
        }

        // Determine strength level
        let strengthLevel;
        if (calculatedScore < 30) {
            strengthLevel = 'Very Weak';
        } else if (calculatedScore < 50) {
            strengthLevel = 'Weak';
        } else if (calculatedScore < 70) {
            strengthLevel = 'Medium';
        } else if (calculatedScore < 85) {
            strengthLevel = 'Strong';
        } else {
            strengthLevel = 'Very Strong';
        }

        return { strength: strengthLevel, score: calculatedScore, criteriaMet: newCriteriaMet };
    };

    const analyzeBulkPasswords = () => {
        const passwords = bulkPasswords
            .map(p => p.value.trim())
            .filter(p => p.length > 0);

        if (passwords.length === 0) {
            return;
        }

        const results = passwords.map(pwd => {
            const result = checkPasswordStrength(pwd);
            return {
                password: pwd,
                strength: result.strength,
                score: result.score
            };
        });

        const totalScore = results.reduce((sum, r) => sum + r.score, 0);
        const averageScore = totalScore / results.length;

        const strengthCounts = {
            'Very Weak': 0,
            'Weak': 0,
            'Medium': 0,
            'Strong': 0,
            'Very Strong': 0
        };

        results.forEach(r => {
            strengthCounts[r.strength]++;
        });

        let overallStrength;
        if (averageScore < 30) {
            overallStrength = 'Very Weak';
        } else if (averageScore < 50) {
            overallStrength = 'Weak';
        } else if (averageScore < 70) {
            overallStrength = 'Medium';
        } else if (averageScore < 85) {
            overallStrength = 'Strong';
        } else {
            overallStrength = 'Very Strong';
        }

        setBulkResults({
            passwords: results,
            averageScore: Math.round(averageScore),
            overallStrength,
            strengthCounts,
            totalCount: passwords.length
        });
    };

    const addPasswordField = () => {
        const newId = Math.max(...bulkPasswords.map(p => p.id)) + 1;
        setBulkPasswords([...bulkPasswords, { id: newId, value: '' }]);
    };

    const removePasswordField = (id) => {
        if (bulkPasswords.length > 1) {
            setBulkPasswords(bulkPasswords.filter(p => p.id !== id));
        }
    };

    const updatePasswordField = (id, value) => {
        setBulkPasswords(bulkPasswords.map(p => 
            p.id === id ? { ...p, value } : p
        ));
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            // Extract potential passwords - look for non-empty lines or words
            const extractedPasswords = text
                .split(/[\n\r\s,;]+/)
                .map(p => p.trim())
                .filter(p => p.length >= 3 && p.length <= 128) // Reasonable password length
                .filter(p => p.length > 0);

            if (extractedPasswords.length === 0) {
                alert('No passwords found in the document.');
                return;
            }

            // Create new password fields from extracted passwords
            const newPasswordFields = extractedPasswords.map((pwd, index) => ({
                id: index + 1,
                value: pwd
            }));

            setBulkPasswords(newPasswordFields);
            // Clear the file input
            event.target.value = '';
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Error reading file. Please make sure it\'s a text file.');
        }
    };

    useEffect(() => {
        if (mode === 'single') {
            const result = checkPasswordStrength(password);
            setStrength(result.strength);
            setScore(result.score);
            setCriteriaMet(result.criteriaMet);
        }
    }, [password, mode]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const criteria = [
        { key: 'length', text: 'At least 8 characters' },
        { key: 'uppercase', text: 'Contains uppercase letter' },
        { key: 'lowercase', text: 'Contains lowercase letter' },
        { key: 'number', text: 'Contains number' },
        { key: 'special', text: 'Contains special character' }
    ];

    return (
        <div className="card">
            <h2 className="title">Password Strength Tester</h2>

                {/* Mode Toggle */}
                <div className="mode-toggle">
                    <button
                        className={`mode-button ${mode === 'single' ? 'active' : ''}`}
                        onClick={() => setMode('single')}
                    >
                        Single Password
                    </button>
                    <button
                        className={`mode-button ${mode === 'bulk' ? 'active' : ''}`}
                        onClick={() => setMode('bulk')}
                    >
                        Bulk Analysis
                    </button>
                </div>

                {mode === 'single' ? (
                    <>
                        <div className="input-section">
                            <label htmlFor="password-input" className="input-label">
                                Enter Password:
                            </label>
                            <input
                                id="password-input"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={handlePasswordChange}
                                className="password-input"
                                placeholder="Type your password..."
                            />
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="show-password"
                                    checked={showPassword}
                                    onChange={togglePasswordVisibility}
                                />
                                <label htmlFor="show-password" className="checkbox-label">
                                    Show Password
                                </label>
                            </div>
                        </div>

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
                                        width: `${score}%`,
                                        backgroundColor: strengthColors[strength]
                                    }}
                                ></div>
                            </div>
                        </div>

                        <div className="criteria-section">
                            <h3 className="criteria-title">Password Requirements:</h3>
                            <ul className="criteria-list">
                                {criteria.map(({ key, text }) => (
                                    <li 
                                        key={key}
                                        className={`criteria-item ${criteriaMet[key] ? 'met' : 'unmet'}`}
                                    >
                                        <span className="criteria-icon">
                                            {criteriaMet[key] ? '✓' : '✗'}
                                        </span>
                                        <span className="criteria-text">{text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bulk-section">
                            <div className="bulk-header">
                                <label className="input-label">
                                    Enter Passwords to Analyze:
                                </label>
                                <label className="scan-document-button">
                                    <input
                                        type="file"
                                        accept=".txt,.csv,.log"
                                        onChange={handleFileUpload}
                                        style={{ display: 'none' }}
                                    />
                                    📄 Scan Document
                                </label>
                            </div>
                            <div className="password-fields-container">
                                {bulkPasswords.map((pwd, index) => (
                                    <div key={pwd.id} className="bulk-password-field">
                                        <span className="field-number">{index + 1}</span>
                                        <input
                                            type="text"
                                            value={pwd.value}
                                            onChange={(e) => updatePasswordField(pwd.id, e.target.value)}
                                            className="bulk-password-input"
                                            placeholder="Enter password..."
                                        />
                                        {bulkPasswords.length > 1 && (
                                            <button
                                                onClick={() => removePasswordField(pwd.id)}
                                                className="remove-field-button"
                                                title="Remove this field"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button onClick={addPasswordField} className="add-field-button">
                                + Add Another Password
                            </button>
                            <button onClick={analyzeBulkPasswords} className="analyze-button">
                                Analyze Passwords
                            </button>
                        </div>

                        {bulkResults && (
                            <div className="bulk-results">
                                <h3 className="bulk-title">Overall Security Analysis</h3>
                                
                                <div className="overall-stats">
                                    <div className="stat-card">
                                        <span className="stat-label">Total Passwords:</span>
                                        <span className="stat-value">{bulkResults.totalCount}</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Average Score:</span>
                                        <span className="stat-value">{bulkResults.averageScore}%</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-label">Overall Strength:</span>
                                        <span 
                                            className="stat-value"
                                            style={{ color: strengthColors[bulkResults.overallStrength] }}
                                        >
                                            {bulkResults.overallStrength}
                                        </span>
                                    </div>
                                </div>

                                <div className="strength-distribution">
                                    <h4 className="distribution-title">Strength Distribution:</h4>
                                    {Object.entries(bulkResults.strengthCounts).map(([strength, count]) => (
                                        <div key={strength} className="distribution-item">
                                            <span className="distribution-label">{strength}:</span>
                                            <div className="distribution-bar-container">
                                                <div 
                                                    className="distribution-bar"
                                                    style={{ 
                                                        width: `${(count / bulkResults.totalCount) * 100}%`,
                                                        backgroundColor: strengthColors[strength]
                                                    }}
                                                />
                                            </div>
                                            <span className="distribution-count">{count}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="password-list">
                                    <h4 className="list-title">Individual Results:</h4>
                                    <div className="password-list-container">
                                        {bulkResults.passwords.map((pwd, index) => (
                                            <div key={index} className="password-item">
                                                <span className="password-text" title={pwd.password}>
                                                    {pwd.password.length > 30 ? pwd.password.substring(0, 30) + '...' : pwd.password}
                                                </span>
                                                <span 
                                                    className="password-strength"
                                                    style={{ color: strengthColors[pwd.strength] }}
                                                >
                                                    {pwd.strength} ({pwd.score}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}

        </div>
    );
}
