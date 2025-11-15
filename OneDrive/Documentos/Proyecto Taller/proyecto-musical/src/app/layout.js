import StoreProvider from '../providers/StoreProviders';
import './globals.css';

export const metadata = {
  title: 'Proyecto Musical',
  description: 'Tu plataforma de música favorita',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}