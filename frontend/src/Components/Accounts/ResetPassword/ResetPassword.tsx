import  { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css'

function ResetPassword() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const token = queryParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Send request to the backend
        const response = await fetch('https://localhost:7229/api/Accounts/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, newPassword })
        });

        if (response.ok) {
            setSuccess("Password reset successful!");
            setTimeout(() => navigate('/login'), 2000); // Redirect to login page
        } else {
            setError("Invalid token or email.");
        }
    };

    return (
        <div className="reset-password-container">
        <h2>Reset Password</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button type="submit">Submit</button>
        </form>
    </div>
        
    );
}

export default ResetPassword;
