import { SettingsContext, useSettingsContext } from '../../settings';

type Settings = React.ContextType<typeof SettingsContext>['settings'];

export const useNotificationSound = (...additionalChecks: (keyof Settings)[]) => {
    const { settings } = useSettingsContext();

    return () => {
        if (!settings.notificationAudioEnabled) return;

        for (const check of additionalChecks) {
            if (!settings[check]) return;
        }

        const audio = new Audio('/assets/sound-notification.mp3');
        audio.volume = (settings.notificationVolume ?? 70) / 100;

        audio.play().catch((err) =>
            console.error('Error playing sound:', err)
        );
    };
};