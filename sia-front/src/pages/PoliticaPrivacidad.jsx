import React from 'react';
import Navbar from '../components/Navbar';


const PoliticaPrivacidad = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Política de Privacidad de SIA</h1>
          <p className="text-sm text-gray-500 mb-6">Última actualización: 25 de agosto de 2025</p>

          <div className="space-y-6 text-gray-700">
            <p>Bienvenido a SIA (Sistemas de Información Agrícola). Tu privacidad es de suma importancia para nosotros. Esta política explica qué información recopilamos, cómo la usamos y qué derechos tienes en relación con ella.</p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Información que Recopilamos</h2>
              <p>Recopilamos información para proporcionar y mejorar nuestros servicios. Esto incluye:</p>
              <ul className="list-disc list-inside mt-2 pl-4 space-y-1">
                <li><strong>Información de la cuenta:</strong> Cuando te registras, recopilamos tu nombre, correo electrónico y ubicación (municipio).</li>
                <li><strong>Información de los cultivos:</strong> Al usar la aplicación, registras datos sobre tus cultivos, como nombre del cultivo, localización, espacio sembrado, cantidad estimada y fechas de siembra.</li>
                <li><strong>Datos de uso:</strong> Podemos recopilar información sobre cómo interactúas con nuestra plataforma para mejorar la experiencia del usuario.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Cómo Usamos tu Información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul className="list-disc list-inside mt-2 pl-4 space-y-1">
                <li>Proporcionar, operar y mantener nuestros servicios.</li>
                <li>Mejorar, personalizar y expandir nuestros servicios, incluyendo el "Asesor de Siembra" y las gráficas de producción.</li>
                <li>Analizar datos de forma anónima y agregada para generar estadísticas y proyecciones de mercado.</li>
                <li>Comunicarnos contigo, ya sea para soporte técnico o para informarte sobre actualizaciones.</li>
                <li>Prevenir fraudes y garantizar la seguridad de nuestra plataforma.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. Intercambio y Divulgación de Datos</h2>
              <p>No vendemos ni alquilamos tu información personal. La información agregada y anónima sobre la producción de cultivos puede ser utilizada para las funcionalidades predictivas de la plataforma, beneficiando a toda la comunidad de usuarios, pero nunca revelaremos tus datos personales o los de tu finca específica sin tu consentimiento.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Seguridad de los Datos</h2>
              <p>Implementamos medidas de seguridad para proteger tu información. Las contraseñas se almacenan de forma cifrada (hashed) y el acceso a las rutas sensibles está protegido.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Tus Derechos</h2>
              <p>Tienes derecho a acceder, corregir o eliminar tu información personal en cualquier momento a través de tu panel de control o contactándonos directamente.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Contacto</h2>
              <p>Si tienes alguna pregunta sobre esta Política de Privacidad, por favor contáctanos en <a href="mailto:privacidad@siapp.com" className="text-green-600 hover:underline">privacidad@siapp.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
    
    </div>
  );
};

export default PoliticaPrivacidad;