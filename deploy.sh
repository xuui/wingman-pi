#!/bin/sh
mkdir ~/auntie.dot.git
chmod 755 ~/wingman-pi.git
cd ~/wingman-pi.git
git --bare init

#vim hook/post-receive
cat << "EOF" > hooks/post-receive
#!/bin/sh
GIT_WORK_TREE=$HOME/wingman-pi.git git checkout -f
EOF
chmod +x hooks/post-receive
ls -l hooks/*
