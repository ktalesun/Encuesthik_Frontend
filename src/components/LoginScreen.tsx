import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChartBar } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({
  onLogin,
}: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <ChartBar className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl">Encues-Think</h1>
          </div>
          <p className="text-slate-500">
            Gestión de encuestas empresariales
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@empresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            {isRegister && (
              <div className="space-y-2">
                <Label htmlFor="company">
                  Nombre de empresa
                </Label>
                <Input
                  id="company"
                  placeholder="Mi Empresa S.A."
                />
              </div>
            )}
          </div>

          <Button className="w-full" onClick={onLogin}>
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </Button>

          <div className="text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}