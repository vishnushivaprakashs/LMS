# 🔧 Video Upload Troubleshooting Guide

## ❌ Error: "Please fill in lesson title and upload a video"

### Why This Happens

This error appears when you try to add a lesson but:
1. ❌ Lesson title is empty, OR
2. ❌ Video hasn't been uploaded to Cloudinary yet

### ✅ Solution - Follow These Steps:

#### Step 1: Enter Lesson Title
```
✅ Fill in "Lesson Title" field
Example: "Introduction to HTML"
```

#### Step 2: Enter Lesson Description (Optional)
```
✅ Fill in "Lesson Description" field
Example: "Learn the basics of HTML..."
```

#### Step 3: Select Video File
```
✅ Click the upload area or drag & drop
✅ Select your video file (MP4, WebM, or MOV)
✅ File must be under 100MB
```

#### Step 4: **IMPORTANT - Click "Upload Video" Button**
```
⚠️ After selecting the file, you MUST click the blue "Upload Video" button!
⚠️ Wait for the progress bar to reach 100%
⚠️ You'll see a green success message when done
```

#### Step 5: Add the Lesson
```
✅ Now click "Add Lesson" button
✅ Your lesson will be added to the curriculum
```

---

## 🎯 Visual Guide

### What You See in Your Screenshot:

```
✅ Lesson Title: "HTML" ← GOOD
✅ Lesson Description: Filled ← GOOD
✅ Video Selected: "Smart Pill Dispenser.mp4" (4.66 MB) ← GOOD
❌ Video NOT uploaded yet ← PROBLEM!
```

### What You Need to Do:

```
1. Click the blue "Upload Video" button
2. Wait for upload (you'll see progress bar)
3. See green checkmark when done
4. Then click "Add Lesson"
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Upload Video" Button Not Working

**Symptoms:**
- Click button but nothing happens
- No progress bar appears

**Solutions:**
1. Check browser console (F12) for errors
2. Verify backend is running on port 5000
3. Check Cloudinary credentials in `.env`
4. Try refreshing the page

**Test Backend:**
```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Should return: {"status":"ok"}
```

### Issue 2: Upload Fails with Error

**Symptoms:**
- Red error message appears
- Upload doesn't complete

**Common Errors:**

#### "File too large"
```
❌ Error: File size exceeds 100MB limit
✅ Solution: Compress your video or use a smaller file
```

#### "Invalid file type"
```
❌ Error: Only MP4, WebM, and MOV files are allowed
✅ Solution: Convert your video to MP4 format
```

#### "Network error"
```
❌ Error: Failed to upload video
✅ Solution: Check internet connection and backend status
```

#### "Unauthorized"
```
❌ Error: 401 Unauthorized
✅ Solution: Login again (token expired)
```

### Issue 3: Upload Stuck at 0%

**Solutions:**
1. Check internet connection
2. Verify Cloudinary credentials
3. Check backend logs for errors
4. Try smaller video file first

### Issue 4: Upload Completes but Lesson Won't Add

**Check:**
1. Is there a green "✅ Video uploaded successfully" message?
2. Check browser console for `videoUrl` value
3. Refresh page and try again

---

## 🧪 Testing Steps

### Test 1: Basic Upload
```
1. Enter title: "Test Lesson"
2. Select small video (< 10MB)
3. Click "Upload Video"
4. Wait for completion
5. Click "Add Lesson"
6. ✅ Should work!
```

### Test 2: Check Backend
```bash
# Terminal 1 - Backend should show:
🚀 Server running on port 5000
✅ Cloudinary Connected Successfully

# If not, restart backend:
cd backend
npm run dev
```

### Test 3: Check Frontend
```bash
# Terminal 2 - Frontend should show:
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/

# If not, restart frontend:
cd frontend
npm run dev
```

---

## 📋 Pre-Upload Checklist

Before uploading, verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged in as instructor
- [ ] Cloudinary credentials in backend `.env`
- [ ] Video file < 100MB
- [ ] Video format: MP4, WebM, or MOV
- [ ] Internet connection active

---

## 🔧 Backend Configuration Check

### 1. Check `.env` File

```bash
# backend/.env should have:
CLOUDINARY_CLOUD_NAME=dybcjvbwz
CLOUDINARY_API_KEY=229728139224424
CLOUDINARY_API_SECRET=_JGo6C7HxzwdKYq8YD8iE0EmX6k
```

### 2. Test Cloudinary Connection

```bash
# In backend directory:
node -e "require('./src/config/cloudinary.js')"

# Should show:
# ✅ Cloudinary Connected Successfully
```

### 3. Check Upload Route

```bash
# Test upload endpoint:
curl -X POST http://localhost:5000/api/upload/video \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@path/to/test.mp4"
```

---

## 🐛 Debug Mode

### Enable Console Logging

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for these messages:

**On Upload Success:**
```javascript
Video upload success: {
  secure_url: "https://res.cloudinary.com/...",
  public_id: "...",
  duration: 15,
  thumbnail: "..."
}
```

**On Upload Error:**
```javascript
Video upload error: "Error message here"
```

### Backend Logs

Watch backend terminal for:
```
POST /api/upload/video
✅ Video uploaded to Cloudinary
```

---

## ✅ Success Indicators

You know it's working when you see:

1. **During Upload:**
   - Progress bar moving 0% → 100%
   - Blue "Uploading..." text

2. **After Upload:**
   - Green "✅ Video uploaded successfully" box
   - Duration shown (e.g., "Duration: 15 minutes")
   - Thumbnail preview (if available)

3. **After Adding Lesson:**
   - Lesson appears in "Course Curriculum" list
   - Video thumbnail visible
   - "📹 Video" badge shown
   - Duration displayed

---

## 🆘 Still Not Working?

### Quick Fixes:

1. **Restart Everything:**
   ```bash
   # Stop both servers (Ctrl+C)
   # Restart backend
   cd backend && npm run dev
   # Restart frontend (new terminal)
   cd frontend && npm run dev
   ```

2. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Refresh page (Ctrl+F5)

3. **Check Cloudinary Dashboard:**
   - Login to cloudinary.com
   - Check if videos are appearing
   - Verify quota not exceeded

4. **Try Different Video:**
   - Use a very small video (< 5MB)
   - Use MP4 format only
   - Test with sample video

---

## 📞 Getting Help

If still having issues, provide:

1. **Error Message:** (exact text)
2. **Browser Console:** (F12 → Console tab)
3. **Backend Logs:** (terminal output)
4. **Video Details:** (size, format)
5. **Steps Taken:** (what you tried)

---

## 🎯 Quick Reference

### The Upload Process:
```
1. Select file → 2. Click "Upload Video" → 3. Wait → 4. See success → 5. Add lesson
```

### Common Mistake:
```
❌ Select file → Add Lesson (WRONG - video not uploaded!)
✅ Select file → Upload Video → Wait → Add Lesson (CORRECT!)
```

---

**Remember: Selecting a file ≠ Uploading a file!**

You must click "Upload Video" button after selecting the file! 🎬
