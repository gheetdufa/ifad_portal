# 🎓 IFAD Portal - Content Editing Guide

**For Non-Technical Users: How to Edit Website Content**

This guide is designed for anyone who needs to update text, dates, or other content on the IFAD (Intern For A Day) website, even if you don't know how to code!

## 🔍 Quick Start: Finding What You Want to Edit

### Method 1: Using GitHub's Search Bar
1. **Click the search bar** at the very top of this GitHub page
2. **Type the exact text** you want to change (e.g., "Spring 2025" or "Host Registration")
3. **Press Enter** - GitHub will show you all files containing that text
4. **Click on the file** that contains your text (usually ends in `.tsx`)

### Method 2: Using the File Browser
Navigate through the folders to find what you need:

```
📁 src/
├── 📁 pages/           ← Main website pages
│   ├── HomePage.tsx    ← Homepage content
│   ├── PublicHostList.tsx ← Host directory page
│   ├── LoginPage.tsx   ← Login page
│   └── ...
├── 📁 components/      ← Reusable website parts
└── 📁 assets/         ← Images and files
```

---

## 📍 Where to Find Common Content

### 🏠 **Homepage Content** → `src/pages/HomePage.tsx`
- Main hero section text
- "Your Path to Career Discovery" section
- Timeline dates and information
- Program statistics
- Testimonials

### 📋 **Host Directory** → `src/pages/PublicHostList.tsx`
- Host listings and information
- Requirements section
- Search filters

### 🗓️ **Timeline & Dates** → `src/pages/HomePage.tsx`
- Look for sections with dates like "Aug 11 - Sep 29"
- Search for "Timeline" or specific months

### ⚙️ **Program Requirements** → `src/pages/PublicHostList.tsx`
- Citizenship requirements
- Background check info
- Metro accessibility

---

## ✏️ How to Edit Content (Step-by-Step)

### Step 1: Find Your Content
1. Use the search bar (🔍) at the top of GitHub
2. Type the **exact text** you want to change
3. Click on the file that appears in results

### Step 2: Open the File for Editing
1. **Click the pencil icon** (✏️) on the right side of the file
2. This opens the file in edit mode

### Step 3: Make Your Changes
1. **Find the text** you want to change (use Ctrl+F to search within the file)
2. **Simply type** your new text to replace the old text
3. **Be careful** not to delete quotation marks `"` or special characters

### Step 4: Save Your Changes
1. **Scroll down** to the bottom of the page
2. **Add a description** of what you changed (e.g., "Updated dates for Fall 2025")
3. **Click "Commit changes"**

---

## 🎯 Common Editing Tasks

### ✅ **Updating Dates**
**What to search for:** `"Aug 11 - Sep 29"` or `"Spring 2025"`

**Example change:**
```
Before: "Aug 11 - Sep 29"
After:  "Aug 15 - Oct 3"
```

### ✅ **Changing Program Information**
**What to search for:** `"Host Registration"` or specific program details

**Example change:**
```
Before: "Host registration for Spring 2025"
After:  "Host registration for Fall 2025"
```

### ✅ **Updating Statistics**
**What to search for:** `"500+"` or `"200+"` (look for numbers)

**Example change:**
```
Before: "500+ Students Matched"
After:  "600+ Students Matched"
```

### ✅ **Modifying Instructions**
**What to search for:** The exact text you see on the website

**Example change:**
```
Before: "Complete the required online orientation"
After:  "Complete the mandatory online orientation"
```

---

## 🚨 Important Guidelines

### ✅ **DO:**
- Search for exact text to find what you need
- Make small, specific changes
- Add clear descriptions when saving changes
- Test the website after making changes

### ❌ **DON'T:**
- Delete quotation marks `"` or brackets `{}`
- Change anything that looks like code (e.g., `className=` or `<div>`)
- Edit multiple files at once
- Delete entire lines unless you're sure

---

## 📁 Quick Reference: File Locations

| What You Want to Edit | File Location | Search Terms |
|----------------------|---------------|--------------|
| **Homepage title & description** | `src/pages/HomePage.tsx` | "Explore Careers with", "Intern For A Day" |
| **Program timeline dates** | `src/pages/HomePage.tsx` | "Timeline", month names, specific dates |
| **Host requirements** | `src/pages/PublicHostList.tsx` | "Requirements", "Citizenship", "Background Check" |
| **Student steps** | `src/pages/HomePage.tsx` | "Your Path to Career Discovery", "Complete Orientation" |
| **Host steps** | `src/pages/HomePage.tsx` | "Share Your Expertise", "Register to Host" |
| **Statistics numbers** | `src/pages/HomePage.tsx` | "500+", "200+", "95%" |
| **Contact/registration links** | Various files | "umd-ucc.catalog.instructure.com", "login" |

---

## 🔧 Advanced Tips

### Finding Text Across All Files
1. **Use the main search bar** at the top of GitHub
2. **Add `in:file`** to your search (e.g., `"Spring 2025" in:file`)
3. This searches inside all files, not just file names

### Making Multiple Related Changes
1. **Make one change at a time**
2. **Save each change separately**
3. **Test the website** between changes
4. **Write clear descriptions** for each change

### Checking Your Changes
After editing, visit the live website to make sure your changes appear correctly:
- Development site: `http://localhost:5173/gheetdufa/ifad_portal/`
- Live site: [Your actual website URL]

---

## 🆘 Need Help?

### Common Problems & Solutions

**Problem:** "I can't find the text I'm looking for"
- **Solution:** Try searching for just part of the text, or look for nearby text

**Problem:** "I accidentally deleted something important"
- **Solution:** Use GitHub's history feature to see previous versions

**Problem:** "My changes aren't showing up"
- **Solution:** Wait a few minutes, then refresh the website

**Problem:** "I'm scared I'll break something"
- **Solution:** GitHub keeps a history of all changes - nothing is permanently lost!

---

*Remember: GitHub automatically saves a history of all changes, so don't worry about making mistakes - they can always be undone!* 