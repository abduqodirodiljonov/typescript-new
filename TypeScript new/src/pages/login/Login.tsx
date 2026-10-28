import { useTranslation } from 'react-i18next';

function Login() {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6 text-stone-800">
      <h1 className="text-xl font-bold">{t('login')}</h1>
    </div>
  );
}

export default Login;