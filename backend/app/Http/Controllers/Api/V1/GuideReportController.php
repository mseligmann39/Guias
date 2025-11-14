<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Guide;
use App\Models\ReporteGuia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class GuideReportController extends Controller
{
    /**
     * Store a new guide report.
     */
    public function store(Request $request, Guide $guide)
    {
        $rules = [
            'razon' => ['required', Rule::in([
                'contenido_inapropiado',
                'guia_falsa',
                'juego_equivocado',
                'otro',
            ])],
            'detalle_opcional' => ['nullable', 'string', 'max:2000'],
        ];

        $data = $request->validate($rules);

        // Si la razón es 'otro', detalle_opcional debe estar presente
        if ($data['razon'] === 'otro' && empty($data['detalle_opcional'])) {
            return response()->json(['message' => 'detalle_opcional es requerido cuando razon es "otro".'], 422);
        }

        $reporte = ReporteGuia::create([
            'guide_id' => $guide->id,
            'usuario_id' => $request->user() ? $request->user()->id : null,
            'razon' => $data['razon'],
            'detalle_opcional' => $data['detalle_opcional'] ?? null,
            'estado' => 'pendiente',
        ]);

        return response()->json($reporte, 201);
    }
}
