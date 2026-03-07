import Link from "next/link";
import { IceCreamIcon, ContainerIcon } from "@/public/icons";

export function SelectSection() {
    return (
        <div className="min-h-screen bg-linear-to-br from-[#f8f7ff] to-[#fef4f4] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Dot Pattern Background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
                aria-hidden="true"
            />

            {/* Main Container */}
            <div className="relative w-full max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12 sm:mb-16">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                            <IceCreamIcon
                                className="text-white"
                                style={{ width: '32px', height: '40px' }}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#141414] mb-4 tracking-tight">
                        Sistema de
                        <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Gestión de Pedidos
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Selecciona una opción para continuar
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                    {/* Card: Realizar Pedidos */}
                    <Link href="/pedidos" className="group">
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                            <div className="flex flex-col items-center text-center">
                                {/* Icon Container */}
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <IceCreamIcon
                                        className="text-white"
                                        style={{ width: '36px', height: '44px' }}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#141414] mb-3">
                                    Realizar Pedidos
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
                                    Crea nuevos pedidos, selecciona presentaciones y sabores para tus clientes
                                </p>

                                {/* Action Button */}
                                <div className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                    <span>Comenzar</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="transform group-hover:translate-x-1 transition-transform"
                                    >
                                        <path
                                            d="M7.5 15L12.5 10L7.5 5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card: Vista Pedidos */}
                    <Link href="/pedidos-resumen" className="group">
                        <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                            <div className="flex flex-col items-center text-center">
                                {/* Icon Container */}
                                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <ContainerIcon
                                        className="text-white"
                                        style={{ width: '36px', height: '36px' }}
                                        aria-hidden="true"
                                    />
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl lg:text-3xl font-bold text-[#141414] mb-3">
                                    Vista de Pedidos
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 text-base lg:text-lg mb-6 leading-relaxed">
                                    Revisa el resumen de pedidos activos y su estado actual
                                </p>

                                {/* Action Button */}
                                <div className="inline-flex items-center gap-2 text-purple-600 font-semibold group-hover:gap-3 transition-all">
                                    <span>Ver pedidos</span>
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="transform group-hover:translate-x-1 transition-transform"
                                    >
                                        <path
                                            d="M7.5 15L12.5 10L7.5 5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-gray-500">
                        Sistema de gestión v1.0 • Luva Ice Cream
                    </p>
                </div>
            </div>
        </div>
    );
}