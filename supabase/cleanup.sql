-- Cleanup mock projects
DELETE FROM public.projects WHERE title IN (
    'Branding Café Artesanal', 
    'Lançamento Moda Sustentável', 
    'Studio de Beleza Premium', 
    'Restaurante Gastronômico'
);

-- Cleanup mock posts
DELETE FROM public.posts WHERE client IN (
    'Cafe Botanica', 
    'Studio Ella', 
    'Flora & Co', 
    'Maison Belle', 
    'Petit Gateau', 
    'Atelier Rose'
);

-- Cleanup mock messages
DELETE FROM public.messages WHERE email IN (
    'mariaclara@email.com', 
    'fernanda.lima@email.com', 
    'rafael@cafebotanica.com', 
    'ju.torres@email.com', 
    'amanda@floresco.com'
);
