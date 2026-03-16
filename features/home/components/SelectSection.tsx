import Link from 'next/link';
import { ContainerIcon, IceCreamIcon } from '@/public/icons';

export function SelectSection() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-[#f8f7ff] to-[#fef4f4] p-4 sm:p-6 lg:p-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #141414 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-5xl">
        <div className="mb-12 text-center sm:mb-16">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 rotate-3 items-center justify-center rounded-3xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg transition-transform hover:rotate-6 sm:h-20 sm:w-20">
              <IceCreamIcon
                className="text-white"
                style={{ width: '32px', height: '40px' }}
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#141414] sm:text-5xl lg:text-6xl">
            Sistema de
            <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestion de Pedidos
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            Selecciona una opcion para continuar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          <Link href="/pedidos" className="group">
            <div className="cursor-pointer rounded-3xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl lg:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-24 lg:w-24">
                  <IceCreamIcon
                    className="text-white"
                    style={{ width: '36px', height: '44px' }}
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-[#141414] lg:text-3xl">
                  Realizar Pedidos
                </h2>

                <p className="mb-6 text-base leading-relaxed text-gray-600 lg:text-lg">
                  Crea nuevos pedidos, selecciona presentaciones y sabores para tus clientes
                </p>

                <div className="inline-flex items-center gap-2 font-semibold text-blue-600 transition-all group-hover:gap-3">
                  <span>Comenzar</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform group-hover:translate-x-1"
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

          <Link href="/pedidos-resumen/seleccionar" className="group">
            <div className="cursor-pointer rounded-3xl border border-gray-100 bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl lg:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 shadow-lg transition-transform duration-300 group-hover:scale-110 lg:h-24 lg:w-24">
                  <ContainerIcon
                    className="text-white"
                    style={{ width: '36px', height: '36px' }}
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-[#141414] lg:text-3xl">
                  Vista de Pedidos
                </h2>

                <p className="mb-6 text-base leading-relaxed text-gray-600 lg:text-lg">
                  Revisa el resumen de pedidos activos y su estado actual
                </p>

                <div className="inline-flex items-center gap-2 font-semibold text-purple-600 transition-all group-hover:gap-3">
                  <span>Ver pedidos</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transition-transform group-hover:translate-x-1"
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

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">Sistema de gestion v1.0 • Luvasi Ice Cream</p>
        </div>
      </div>
    </div>
  );
}

