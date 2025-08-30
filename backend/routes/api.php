<?php

use App\Http\Controllers\RemindersController;

Route::get('/reminders', [RemindersController::class, 'getReminders']);
Route::post('/reminders', [RemindersController::class, 'createReminder']);