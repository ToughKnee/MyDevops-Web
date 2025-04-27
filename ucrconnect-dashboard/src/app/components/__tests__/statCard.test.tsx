import { render, screen } from '@testing-library/react';
import StatCard from '@/components/statCard';

describe('StatCard component', () => {
  it('muestra correctamente datos con cambio positivo', () => {
    const props = {
      title: 'Usuarios',
      value: 1200,
      change: 8,
    };

    render(<StatCard {...props} />);

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('1200')).toBeInTheDocument();
    expect(screen.getByText('+8%')).toBeInTheDocument();
  });

  it('muestra correctamente datos con cambio negativo', () => {
    const props = {
      title: 'Reportes',
      value: 95,
      change: -12,
    };

    render(<StatCard {...props} />);

    expect(screen.getByText('Reportes')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('-12%')).toBeInTheDocument();
  });

  it('no muestra cambio cuando es cero', () => {
    const props = {
      title: 'Publicaciones',
      value: 500,
      change: 0,
    };
  
    render(<StatCard {...props} />);
  
    expect(screen.getByText('Publicaciones')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.queryByText('+0%')).not.toBeInTheDocument();
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('debe renderizar el componente como enlace cuando se pasa route', () => {
    const props = {
      title: 'Usuarios',
      value: 1200,
      change: 8,
      route: '/usuarios',
    };
  
    render(<StatCard {...props} />);
    const linkElement = screen.getByRole('link');
  
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('role', 'link');
  });

  it('debe mostrar icono de flecha hacia arriba cuando el cambio es positivo', () => {
    const props = { title: 'Usuarios', value: 1000, change: 10 };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByRole('region')).toHaveTextContent('+10%');
  });
  
  it('debe mostrar icono de flecha hacia abajo cuando el cambio es negativo', () => {
    const props = { title: 'Usuarios', value: 1000, change: -10 };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByRole('region')).toHaveTextContent('-10%');
  });

  it('debe aplicar un fondo personalizado cuando se pasa bgStyle', () => {
    const props = { title: 'Usuarios', value: 1200, change: 8, bgStyle: 'bg-blue-100' };
    
    render(<StatCard {...props} />);
    
    expect(screen.getByRole('region')).toHaveClass('bg-blue-100');
  });

  it('navega correctamente al hacer click cuando hay route', () => {
    const props = {
      title: 'Usuarios',
      value: 1200,
      change: 8,
      route: '/usuarios',
    };
  
    delete (window as any).location;
    (window as any).location = { href: '' };
  
    render(<StatCard {...props} />);
    const link = screen.getByRole('link');
    link.click();
  
    expect(window.location.href).toBe('/usuarios');
  });

  it('navega al presionar Enter en un componente con route', () => {
    const props = {
      title: 'Usuarios',
      value: 1200,
      change: 8,
      route: '/usuarios',
    };
  
    delete (window as any).location;
    (window as any).location = { href: '' };
  
    render(<StatCard {...props} />);
    const link = screen.getByRole('link');
    link.focus();
  
    link.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  
    expect(window.location.href).toBe('/usuarios');
  });
});
