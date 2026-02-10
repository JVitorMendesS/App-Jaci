import React, { useState } from 'react';
import { useStoreConfig } from '../contexts/StoreConfigContext';

const StoreConfigPanel: React.FC = () => {
  const { config, updateConfig } = useStoreConfig();
  const [logoUrl, setLogoUrl] = useState(config.logoUrl);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({ logoUrl, primaryColor });
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-jaci-dark mb-4">
        Configuração da Loja
      </h2>

      <form onSubmit={handleSave} className="space-y-6 max-w-lg">
        {/* Logo */}
        <div>
          <label className="block text-gray-700 mb-1">URL da logo da home</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
            placeholder="https://exemplo.com/logo.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Coloque o link de uma imagem (PNG/JPG/SVG). Depois podemos fazer upload
            direto pelo sistema.
          </p>

          {logoUrl && (
            <div className="mt-3">
              <span className="text-sm text-gray-600">Pré-visualização:</span>
              <div className="mt-2 inline-flex items-center justify-center border rounded-lg bg-white p-2">
                <img
                  src={logoUrl}
                  alt="Pré-visualização da logo"
                  className="h-12 object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Cor predominante */}
        <div>
          <label className="block text-gray-700 mb-1">Cor predominante</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-jaci-blue"
              placeholder="#0057b8"
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Use um código HEX (ex: #0057b8).
          </p>
        </div>

        <button
          type="submit"
          className="bg-jaci-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Salvar configurações
        </button>
      </form>
    </div>
  );
};

export default StoreConfigPanel;
