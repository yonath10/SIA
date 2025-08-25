import React from 'react';
import Navbar from '../components/Navbar';


const TerminosCondiciones = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b pb-2">Términos y Condiciones de Uso</h1>
          <p className="text-sm text-gray-500 mb-6">Última actualización: 25 de agosto de 2025</p>

          <div className="space-y-6 text-gray-700">
            <p>Estos Términos y Condiciones rigen el uso de la plataforma SIA (en adelante, "el Servicio"). Al acceder o utilizar el Servicio, aceptas estar sujeto a estos términos.</p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Cuentas de Usuario</h2>
              <p>Para utilizar las funcionalidades completas del Servicio, debes registrarte y crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran en tu cuenta. Debes proporcionar información precisa y completa.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Uso del Servicio</h2>
              <p>El Servicio se proporciona para ayudarte en la gestión de tus cultivos. Te comprometes a no utilizar el Servicio para ningún propósito ilegal o no autorizado. Aceptas que los datos que ingresas, como la información de tus cultivos, son precisos bajo tu mejor conocimiento.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. Contenido Generado por el Usuario</h2>
              <p>Tú conservas todos los derechos sobre la información y los datos de los cultivos que subes a la plataforma. Sin embargo, nos otorgas una licencia mundial, no exclusiva y libre de regalías para usar, reproducir y analizar dichos datos de forma anónima y agregada con el fin de proporcionar y mejorar las funcionalidades del Servicio (como el Asesor de Siembra).</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">4. Limitación de Responsabilidad</h2>
              <p>El Servicio, incluyendo las proyecciones y recomendaciones, se proporciona "tal cual". No garantizamos que las predicciones del mercado sean exactas o que el uso del Servicio garantice un aumento en los beneficios. Las decisiones de siembra y comerciales son de tu exclusiva responsabilidad.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">5. Modificaciones del Servicio</h2>
              <p>Nos reservamos el derecho de modificar o descontinuar, temporal o permanentemente, el Servicio con o sin previo aviso.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">6. Contacto</h2>
              <p>Si tienes alguna pregunta sobre estos Términos, contáctanos en <a href="mailto:terminos@siapp.com" className="text-green-600 hover:underline">terminos@siapp.com</a>.</p>
            </section>
          </div>
        </div>
      </main>
     
    </div>
  );
};

export default TerminosCondiciones;