# SmartTagCustomRingtone
This is a simple guide that shows you how to use a custom ringtone such as the Super Mario theme or the classic Nokia ringtone on your Samsung SmartTag, SmartTag+, or SmartTag2. :)

About 3.5 years ago, I was analyzing the security of Ultra-Wideband (UWB) integration in Samsung phones for my [Master's thesis](https://tuprints.ulb.tu-darmstadt.de/24378/1/Thesis_Martin_Heyden_Final.pdf). As part of that work, I explored the SmartTag+ in detail. During my analysis, I discovered that it is possible to transfer custom ringtones to the device, and I even uploaded a [proof-of-concept video](https://www.youtube.com/watch?v=W5EczljLdPs) demonstrating it. As it turns out, you can still upload a custom ringtone to the SmartTag, even to the latest one which is the SmartTag2. Any SmartTag features a [Piezoelectric speaker](https://en.wikipedia.org/wiki/Piezoelectric_speaker) and you can transfer the notes it should be playing to the device. I will provide you the Super Mario Theme and Nokia ringtone notes in this repository. You will find more ringtone data in the internet. 

[Hear the custom SmartTag2 ringtone in action after following the steps outlined in this guide.](https://youtu.be/Qq_I29kgmC8)


## Disclaimer
I am not responsible for any damage to your phone, SmartTag, SmartThings app, or any other device or software as a result of following this guide.

## Why is this possible?
To be able to control your SmartTag with the SmartThings app, you have to install and use a plugin inside the SmartThings app, which is inofficially called <b><i>TrkPlugin</i></b>. This plugin contains the ringtone data for the SmartTag. When changing the ringtone data in the plugin, then the modified ringtone data is transferred to the SmartTag. <b>This means the ringtone data is not stored directly on the SmartTag; instead, it is stored in the TrkPlugin. By modifying the ringtone data within the plugin, you control what is transferred to the SmartTag - and ultimately, which tones it plays.</b> This guide explains you step-by-step how to do that.

## Guide
### Note
There are several ways to transfer a custom ringtone to the SmartTag, but the simplest method is to add the custom ringtone directly to the TrkPlugin and then transfer it to the SmartTag using the SmartThings app. To modify the TrkPlugin in place, you will need a <b>rooted</b> Android phone.

The good news is that your primary phone does not need to be rooted, and you do not have to remove or reset your SmartTag if it is already set up in SmartThings. You can simply share access to the SmartTag with the rooted device.

Any rooted Android phone will work, as long as it is recent enough to support the SmartThings app. In my case, I tested everything using another Samsung phone, which is rooted.

In the following steps, I will show you how to share access to your SmartTag with a rooted phone and how to make the necessary modifications in the plugin. You can adjust the process as needed — for example, if your main phone is already rooted.

### Part 1 - Install SmartThings and setup the SmartTag on your one
If you haven't set up your SmartTag in the SmartThings app yet, please do so first. If you're unsure how to proceed, you can follow Samsung'S official guides for the [SmartTag (+)](https://www.samsung.com/us/support/answer/ANS00088244/) and [SmartTag2](https://www.samsung.com/ae/support/mobile-devices/how-to-pair-smart-tag-2-with-your-mobile-device/).


### Part 2 - Install SmartThings on a rooted phone and bypass root detection
Install the SmartThings app on your rooted phone. However, keep in mind that starting with version 1.8.18.21, SmartThings includes root detection, which may prevent you from opening the app. There are several ways to bypass this restriction, which are explained by the following three methods. I recommend using method 1 or 2, as they are simpler and safer than method 3.

#### Method 1 - Root detection bypass by installing older SmartThings version
There is no root detection implemented in SmartThings <= 1.8.18.21. Therefore, you can simply install an older supported SmartThings version. For example, you can download version [1.8.18.21](https://www.apkmirror.com/apk/samsung-electronics-co-ltd/samsung-smartthings-samsung-connect/samsung-smartthings-samsung-connect-1-8-18-21-release/) and install it via ADB. No root detection is implemented by that version, and as of July 2025, you can still use it and control you SmartTag, even if you phone has the latest Android version installed. For now, this is the easiest way to bypass root checks.

#### Method 2 - Use my custom Frida script to bypass root checks
Use [Frida](https://github.com/frida/frida) to patch / disable the root checks. I have provided my custom Frida script in this repository that patches the checks. You have to run the Frida script every time you restart the SmartThings app on your rooted phone.

#### Method 3 - Install KnoxPatch 
Install [KnoxPatch](https://github.com/salvogiangri/KnoxPatch), which is using [LSPosed](https://github.com/LSPosed/LSPosed) to patch the root checks. It might only work on Samsung phones, but I do not see any reason why it should not work on a rooted phone that is not a Samsung phone.

### Part 3 - Share access to your SmartTag
Next, you have to share access to your SmartTag. This works by first sharing your SmartThings location (this is not a geolocation) and then enabling access to the SmartTag. Here are the detailed steps:
1. Inside the SmartThings app on your one, go to <i>Manage Locations</i>. You will find that option on the left upper side of the <i>Home</i> tab.
2. Select the SmartThings location to which you have added your SmartTag.
3. Press <i>Invite member</i>. You will now have several options to invite another user: (1) Using a QR code, (2) sending an invitation via mail or to a Samsung account, or (3) sharing a link. Choose your preferred option. For example, you can generate a QR code, which you can then scan with your second (rooted) phone.
4. Accept the invitation on your rooted phone, for example, by scanning the QR code shown on the one. Now, you should have access to the SmartThings location of the main phone's user and you should be able to see the SmartTag as a device belonging to that location. Probably, you won't be able to access the SmartTag yet, since you still have to explictly grant access to the SmartTag itself.
5. On your main phone, go to the SmartTag plugin inside the SmartThings app. Inside the plugin, press <i>View map</i>, which allows you to see the geolocation of the SmartTag and manage access to the SmartTag.
6. In the new geolocation view, select the SmartTag if it is not already selected. Then, on the bottom, you will see four buttons. Press <i>More</i> to get to the SmartTag's location settings.
7. Enable the switch <i>Share location with members</i>.
8. On your second (rooted) phone, you will now have access to the SmartTag and can open the plugin for it. 

### Part 4 - Extract the TrkPlugin on the rooted phone
Now, you have to extract the TrkPlugin. Here are the detailed steps using ADB:
1. Get a root shell on your second (rooted) phone with ADB.
2. Change to this directory: <i>/data/data/com.samsung.android.oneconnect/vmf</i>
3. There will be a folder starting with <i>com.samsung.one.plugin.trkplugin*</i>. Change into that folder.
4. On the latest SmartThings versions, there will be a file named <i>plugin.ppk</i> located in that folder, which is a ZIP file. <b>If not, then you have an older SmartThings version installed and you can continue with the next step</b>. Now, (1) extract the zip file to the <i>files</i> folder located in the same directory and (2) then remove or rename the <i>plugin.ppk</i> file.

### Part 5 - Modify the plugin and add your custom ringtone(s)
This is the final major step. You can now edit the <i>bundle.js</i> file from the TrkPlugin and add your custom ringtone data. The file is located in the <i>/js</i> sub-directory. I recommend to replace the ringtone data (+ optionally the name) of existing ringtones instead of adding new ringtones to the plugin. The <i>bundle.js</i> file is obfuscated and adding additional ringtones requires more work. I have included a ready-to-use <i>bundle.js</i> file in this repository that replaces the name and data of the ringtone <i>Classic tone 01</i> with the Super Mario Theme. This modified <i>bundle.js</i> works at least with the TrkPlugin version <i>124100003</i>. Here are the detailed steps to do the modifications by yourself:
1. Edit <i>bundle.js</i> in place or on your computer (easier). It is located in the /js sub-directory. So the full path will be like <i>/data/data/com.samsung.android.oneconnect/vmf/apk/com.samsung.one.plugin.trkplugin_124100003/files/js</i>.
2. Choose a ringtone tone you want to replace, for example, <i>Classic tone 01</i>.
3. Replace all instances of the ringtone name with your custom name. For example, replace all <i>Classic tone 01</i> instances with <i>Nokia Ringtone</i>.
4. Carefully look for key/value pairs with this format: <i>"TargetRingtoneName":"BREAK,*"</i> (e.g. <i>"Classic tone 01":"BREAK,40,0,DS6,..."</i>). For every occurrence (depending on the plugin version, one or two occurrences exist) replace the existing ringtone data with your ringtone data. See the repository files for the tone data of the Super Mario theme and Nokia ringtone. You will find more in the internet.
5. Replace the existing <i>bundle.js</i> with your modified <i>bundle.js</i> file. I recommend to first backup that file before overwriting it.
6. Finally, open the plugin on your rooted phone. The modified ringtone name should appear in the ringtone menu. You should be able to transfer the modified ringtone data to the SmartTag now and play it.
