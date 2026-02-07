'use client';

import React from 'react';
import styles from './login.module.css';

export default function LoginPage() {

    // Placeholder handler for form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login submitted");
        // Connect to actual backend logic here
    };

    return (
        <div className={styles.container}>

            {/* App Frame (The Central Window) */}
            <div className={styles.appFrame}>

                {/* Pill Navbar */}
                <nav className={styles.navbar}>
                    <div className={styles.logo}>
                        <div className={styles.logoIcon} />
                        Sutura UI
                    </div>

                    <div className={styles.navLinks}>
                        <a href="#" className={styles.navLink}>Features</a>
                        <a href="#" className={styles.navLink}>Pricing</a>
                        <a href="#" className={styles.navLink}>Blog</a>
                        <a href="#" className={styles.navLink}>Changelog</a>
                    </div>

                    <a href="#" className={styles.navCta}>
                        Get Started <span>→</span>
                    </a>
                </nav>

                {/* Login Card (Glassmorphism) */}
                <div className={styles.loginCard}>

                    <div className={styles.header}>
                        <h1 className={styles.title}>Login</h1>
                        <p className={styles.subtitle}>
                            Sign in to access your account with your Notion credentials.
                        </p>
                    </div>

                    {/* Social Buttons */}
                    <div className={styles.socialGroup}>
                        <button type="button" className={styles.socialBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.147 8.053-3.24 2.08-2.08 2.76-5.013 2.76-7.44 0-.747-.053-1.44-.16-2.133h-10.65z" /></svg>
                            Continue with Google
                        </button>
                        <button type="button" className={styles.socialBtn}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.92 3.86-.73 2 .25 3.5.99 4.3 2.3-3.8 1.95-3.1 7.28 1.05 9.07-.61 1.6-1.5 3.1-2.4 4.09l.11.5zM12.03 7.25c-.15-2.96 2.36-5.25 5.09-5.18.3 3.14-3.03 5.4-5.09 5.18z" /></svg>
                            Continue with Apple
                        </button>
                    </div>

                    <div className={styles.divider}>
                        <span className={styles.line}></span>
                        <span>Or</span>
                        <span className={styles.line}></span>
                    </div>

                    {/* Connect to existing Backend (standard names) */}
                    <form className={styles.form} onSubmit={handleSubmit}>

                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                className={styles.input}
                                placeholder="Email or username"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                className={styles.input}
                                placeholder="Password"
                                required
                            />
                        </div>

                        <div className={styles.footer}>
                            <a href="#" className={`${styles.link} ${styles.forgot}`}>Forgot password?</a>
                        </div>

                        <button type="submit" className={styles.loginBtn}>
                            Login
                        </button>

                    </form>

                    <div className={styles.footer} style={{ justifyContent: 'center', marginTop: '10px' }}>
                        <span>Need a new account? <a href="#" className={styles.link}>Sign up</a></span>
                    </div>

                </div>
            </div>
        </div>
    );
}
