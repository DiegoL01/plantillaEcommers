#!/bin/bash

# setup-prisma.sh - Script de configuración automática de Prisma

echo "🚀 Iniciando configuración de Prisma..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
pnpm install

# 2. Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
pnpm prisma:migrate

# 3. Hacer seed de datos
echo "🌱 Agregando datos iniciales..."
pnpm prisma db seed

# 4. Generar cliente
echo "🔧 Generando cliente Prisma..."
pnpm prisma:generate

echo "✅ ¡Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "1. pnpm run dev          - Inicia el servidor"
echo "2. http://localhost:3000 - Abre el navegador"
echo ""
echo "Comandos útiles:"
echo "- pnpm prisma:studio    - Ver datos en interfaz gráfica"
echo "- pnpm prisma:migrate   - Crear nuevas migraciones"
echo "- pnpm prisma:reset     - Resetear todo"
