import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { ROUTES } from "@/shared/model/routes";

const getMessageByStatus = (code: number): string => {
  const messages: Record<number, string> = {
    400: "Неправильний запит. Перевірте передані дані.",
    401: "Не авторизовано. Будь ласка, увійдіть в акаунт.",
    403: "Доступ заборонено. У вас немає прав для перегляду цієї сторінки.",
    404: "Сторінку не знайдено. Можливо, вона була видалена або ви помилились у посиланню.",
    408: "Час очікування минув. Спробуйте ще раз.",
    429: "Занадто багато запитів. Зачекайте трохи.",
    500: "Внутрішня помилка сервера. Наша команда вже працює над вирішенням цієї проблеми.",
    502: "Поганий шлюз. Сервер тимчасово недоступний.",
    503: "Сервіс недоступний. Спробуйте пізніше.",
    504: "Час очікування серверу вичерпано.",
  };

  return messages[code] || "Сталася несподівана помилка. Спробуйте пізніше.";
};

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoHome = () => navigate(ROUTES.DASHBOARD);
  const handleRefresh = () => window.location.reload();

  const statusCode = isRouteErrorResponse(error) ? error.status : 500;
  const message = getMessageByStatus(statusCode);

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Упс! Сталася помилка
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{message}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-4 space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                  Код помилки: {statusCode}
                </h3>
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {message}
                </p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-2xl p-4">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                  Що можна спробувати:
                </h4>
                <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1 text-left">
                  <li>• Оновіть сторінку</li>
                  <li>• Перевірте інтернет-з'єднання</li>
                  <li>• Спробуйте пізніше</li>
                  <li>• Очистіть кеш браузера</li>
                </ul>
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={handleRefresh}
                className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-400/30 active:scale-[0.98]"
              >
                <RefreshCw
                  size={20}
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                Оновити сторінку
              </button>
              <button
                onClick={handleGoHome}
                className="group w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500/30 dark:focus:ring-gray-400/30 active:scale-[0.98]"
              >
                <Home
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Повернутися на головну
              </button>
            </div>
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Проблема не зникає?{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Зв'яжіться з підтримкою
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ErrorPage };
