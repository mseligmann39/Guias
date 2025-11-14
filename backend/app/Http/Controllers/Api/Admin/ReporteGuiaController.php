<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReporteGuia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReporteGuiaController extends Controller
{
    /**
     * Listado paginado de reportes (filtros: estado)
     */
    public function index(Request $request)
    {
        $query = ReporteGuia::with([
            'guia:id,title,slug',
            'usuario:id,name'
        ])->orderBy('created_at', 'desc');

        if ($request->has('estado')) {
            $query->where('estado', $request->get('estado'));
        }

        $perPage = (int) $request->get('per_page', 20);

        $reportes = $query->paginate($perPage);

        return response()->json($reportes);
    }

    /**
     * Muestra un reporte específico
     */
    public function show(ReporteGuia $reporte)
    {
        $reporte->load(['guia', 'usuario']);
        return response()->json($reporte);
    }

    /**
     * Actualiza el estado de un reporte (revisado / ignorado / pendiente)
     */
    public function update(Request $request, ReporteGuia $reporte)
    {
        $data = $request->validate([
            'estado' => ['required', Rule::in(['pendiente', 'revisado', 'ignorado'])],
        ]);

        $reporte->estado = $data['estado'];
        $reporte->save();

        return response()->json($reporte);
    }
}
