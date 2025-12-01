package com.amazonaws.ivs.reactnative.player

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.media.app.NotificationCompat.MediaStyle

class IVSBackgroundService : Service() {

  companion object {
    const val CHANNEL_ID = "IVS_BACKGROUND_PLAYBACK_CHANNEL"
    const val NOTIFICATION_ID = 101

    const val ACTION_PLAY = "com.amazonaws.ivs.reactnative.player.PLAY"
    const val ACTION_PAUSE = "com.amazonaws.ivs.reactnative.player.PAUSE"
    const val ACTION_STOP = "com.amazonaws.ivs.reactnative.player.STOP"

    const val EXTRA_IS_PLAYING = "IS_PLAYING"
    const val NOTIFICATION_TITLE = "NOTIFICATION_TITLE"
    const val NOTIFICATION_TEXT = "NOTIFICATION_TEXT"

  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    val action = intent?.action

    when (action) {
      ACTION_STOP -> {
        stopForeground(true)
        stopSelf()
        return START_NOT_STICKY
      }

      ACTION_PLAY -> {
        sendBroadcast(Intent("IVS_PLAYER_CONTROL").putExtra("action", "play"))
      }

      ACTION_PAUSE -> {
        sendBroadcast(Intent("IVS_PLAYER_CONTROL").putExtra("action", "pause"))
      }
    }

    val isPlaying = intent?.getBooleanExtra(EXTRA_IS_PLAYING, true) ?: true
    val notificationTitle = intent?.getStringExtra(NOTIFICATION_TITLE) ?: ""
    val notificationText = intent?.getStringExtra(NOTIFICATION_TEXT) ?: ""

    createNotificationChannel()
    startForeground(
      NOTIFICATION_ID,
      buildNotification(isPlaying, notificationTitle, notificationText)
    )

    return START_NOT_STICKY
  }

  private fun buildNotification(
    isPlaying: Boolean,
    notificationTitle: String,
    notificationText: String
  ): Notification {
    val packageManager = applicationContext.packageManager
    val launchIntent = packageManager.getLaunchIntentForPackage(applicationContext.packageName)
    val pendingIntent = PendingIntent.getActivity(
      this, 0, launchIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val playIntent = Intent(this, IVSBackgroundService::class.java).apply { action = ACTION_PLAY }
    val pauseIntent = Intent(this, IVSBackgroundService::class.java).apply { action = ACTION_PAUSE }

    val pPlay = PendingIntent.getService(this, 1, playIntent, PendingIntent.FLAG_IMMUTABLE)
    val pPause = PendingIntent.getService(this, 2, pauseIntent, PendingIntent.FLAG_IMMUTABLE)

    val appIcon = applicationInfo.icon

    val builder = NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle(if (notificationTitle != "") notificationTitle else "Player")
      .setContentText(if (notificationText != "") notificationText else if (isPlaying) "Playing" else "Paused")
      .setSmallIcon(appIcon)
      .setContentIntent(pendingIntent)
      .setOngoing(isPlaying)
      .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
      .setStyle(
        MediaStyle()
          .setShowActionsInCompactView(0)
      )

    if (isPlaying) {
      builder.addAction(android.R.drawable.ic_media_pause, "Pause", pPause)
    } else {
      builder.addAction(android.R.drawable.ic_media_play, "Play", pPlay)
    }

    return builder.build()
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val serviceChannel = NotificationChannel(
        CHANNEL_ID,
        "Background Playback",
        NotificationManager.IMPORTANCE_LOW
      )
      val manager = getSystemService(NotificationManager::class.java)
      manager.createNotificationChannel(serviceChannel)
    }
  }
}
