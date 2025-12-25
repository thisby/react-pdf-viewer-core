'use client';
import * as React from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { TextBox } from '../components/TextBox';
import { LocalizationContext } from '../localization/LocalizationContext';
import { PasswordStatus } from '../structs/PasswordStatus';
import styles from '../styles/askingPassword.module.css';
import { TextDirection, ThemeContext } from '../theme/ThemeContext';
import { classNames } from '../utils/classNames';
export const AskingPassword = ({ passwordStatus, renderProtectedView, verifyPassword, onDocumentAskPassword }) => {
    const { l10n } = React.useContext(LocalizationContext);
    const [password, setPassword] = React.useState('');
    const { direction } = React.useContext(ThemeContext);
    const isRtl = direction === TextDirection.RightToLeft;
    const submit = () => verifyPassword(password);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    };
    React.useEffect(() => {
        if (onDocumentAskPassword) {
            onDocumentAskPassword({
                verifyPassword,
            });
        }
    }, []);
    if (renderProtectedView) {
        return renderProtectedView({
            passwordStatus,
            verifyPassword,
        });
    }
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: classNames({
                [styles.inner]: true,
                [styles.innerRtl]: isRtl,
            }) },
            React.createElement("div", { className: styles.message },
                passwordStatus === PasswordStatus.RequiredPassword &&
                    l10n.core.askingPassword
                        .requirePasswordToOpen,
                passwordStatus === PasswordStatus.WrongPassword &&
                    l10n.core.wrongPassword.tryAgain),
            React.createElement("div", { className: styles.body },
                React.createElement("div", { className: classNames({
                        [styles.input]: true,
                        [styles.inputLtr]: !isRtl,
                        [styles.inputRtl]: isRtl,
                    }) },
                    React.createElement(TextBox, { testId: "core__asking-password-input", type: "password", value: password, onChange: setPassword, onKeyDown: handleKeyDown })),
                React.createElement(PrimaryButton, { onClick: submit }, l10n.core.askingPassword.submit)))));
};
