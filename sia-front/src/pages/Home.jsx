import React from 'react';
import { Link } from "react-router-dom";

const homeImageUrl = '/img/home.png'; 
const logoUrl = '/img/sia.png'; 

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src={logoUrl} alt="Logo SIA" className="h-12 mr-2" />
            <span className="text-xl font-bold text-green-700">SIA</span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="border-2 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div 
          className="w-full h-64 sm:h-96 bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${homeImageUrl})` }}
        >
          <div className="text-center px-4">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800">
              <span className="text-green-600">SIA</span> - Sistemas de Información Agrícola
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8">
              Optimiza tu producción agrícola con inteligencia de datos
            </p>
            <Link 
              to="/register" 
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Comenzar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Transforma tu agricultura con SIA
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nuestra plataforma te ofrece las herramientas necesarias para tomar decisiones inteligentes y maximizar tu producción
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Aumento de Productividad</h3>
                </div>
                <p className="text-gray-600">
                  Incrementa el rendimiento de tus cultivos hasta un 30% con nuestras recomendaciones basadas en datos.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Reducción de Costos</h3>
                </div>
                <p className="text-gray-600">
                  Optimiza el uso de recursos y reduce gastos innecesarios con nuestro sistema de monitoreo inteligente.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Toma de Decisiones</h3>
                </div>
                <p className="text-gray-600">
                  Accede a informes detallados y análisis predictivos para tomar las mejores decisiones agrícolas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para transformar tu producción agrícola?</h2>
          <p className="text-xl text-green-100 mb-8">
            Regístrate ahora y comienza a aprovechar el poder de los datos en tu agricultura
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-white text-green-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-all duration-200"
            >
              Comenzar gratis
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white hover:bg-green-600 font-bold py-3 px-8 rounded-lg text-lg transition-all duration-200"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}

export default Home;