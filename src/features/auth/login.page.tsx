import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import { Button } from "@/features/ui/button";
import { Input } from "@/features/ui/input";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Очистити помилку при зміні
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Простая валідація
    const newErrors = {
      email: !formData.email
        ? "Email обов'язковий"
        : !/\S+@\S+\.\S+/.test(formData.email)
        ? "Невірний формат email"
        : "",
      password: !formData.password
        ? "Пароль обов'язковий"
        : formData.password.length < 6
        ? "Пароль має бути мінімум 6 символів"
        : "",
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      // Тут твоя логіка авторизації
      console.log("Form submitted:", formData);

      // Імітація запиту
      setTimeout(() => {
        setIsLoading(false);
        alert("Успішно увійшли!");
      }, 2000);
    } else {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        as="textarea"
        name="email"
        label="Email адреса"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={handleChange}
        icon={<Mail />}
        error={errors.email}
        color="orange"
        autoFocus={true}
      />

      <Input
        type="password"
        name="password"
        label="Пароль"
        placeholder="Введіть ваш пароль"
        value={formData.password}
        onChange={handleChange}
        icon={<Lock size={16} />}
        error={errors.password}
        showToggle={true}
        color="green"
      />

      <Button
        type="submit"
        isLoading={isLoading}
        icon={LogIn}
        disabled={!formData.email || !formData.password}
      >
        {isLoading ? "Входимо..." : "Увійти"}
      </Button>
    </form>
  );
};

export const Component = LoginPage;
