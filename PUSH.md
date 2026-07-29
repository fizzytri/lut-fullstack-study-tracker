# Pushing this repository to GitHub

The public repository already exists and is empty:

<https://github.com/fizzytri/lut-fullstack-study-tracker>

This folder is already a git repository with one commit, so only the remote and the push are left.

## HTTPS

```bash
cd lut-fullstack
git remote add origin https://github.com/fizzytri/lut-fullstack-study-tracker.git
git branch -M main
git push -u origin main
```

Git will ask for your GitHub username and a **personal access token** as the password
(GitHub no longer accepts account passwords). Create one under
Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens,
with `Contents: Read and write` on this repository.

## SSH

If you already have an SSH key on your GitHub account:

```bash
cd lut-fullstack
git remote add origin git@github.com:fizzytri/lut-fullstack-study-tracker.git
git branch -M main
git push -u origin main
```

## Check the author on the commit

The commit was created with a placeholder identity. Set your own before pushing if you want:

```bash
git config user.name "Your Name"
git config user.email "your@email.com"
git commit --amend --reset-author --no-edit
```

## After pushing

1. Record your demo video and put the link in `VIDEO.md`, then commit and push again.
2. Write your learning diary and add it to the repository.
3. Submit the repository URL in Moodle:
   <https://moodle.lut.fi/mod/assign/view.php?id=1746191>
4. Go to the **Course completion** tab in Moodle and request grading.
