<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RemindersController extends Controller
{
    
    public static $reminders = [
        ['text' => 'Take your medication', 'time' => '08:00'],
        ['text' => 'Go to your pilates class', 'time' => '14:00']
    ];

    public function getReminders()
    {
        return response()->json(self::$reminders);
    }

    public function createReminder(Request $request)
    {
        $text = $request->text;
        $time = $request->time;
        
        $reminder = ['text' => $text, 'time' => $time];
        
        array_push(self::$reminders, $reminder);

        return response()->json(['message' => 'reminder added']);
    }
}