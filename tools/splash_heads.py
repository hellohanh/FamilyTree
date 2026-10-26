import sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np
S=sys.argv[1]
HEADS={'splash1':[(448,519,30,33),(607,518,30,33)],'splash2':[(549,721,42,46),(760,722,42,46)]}
def emask(size,e,grow=0):
    m=Image.new('L',size,0);cx,cy,rx,ry=e;ImageDraw.Draw(m).ellipse([cx-rx-grow,cy-ry-grow,cx+rx+grow,cy+ry+grow],fill=255);return m
def radial(size,e,fx,fy,r):
    cx,cy,rx,ry=e;yy,xx=np.mgrid[0:size[1],0:size[0]];d=np.hypot((xx-(cx+fx*rx))/(rx*r),(yy-(cy+fy*ry))/(ry*r));return np.clip(1-d,0,1)
def treat(img,heads,opt):
    a=np.array(img).astype(float);size=img.size
    for e in heads:
        m=np.array(emask(size,e,1)).astype(float)/255;m3=m[...,None]
        rgb=a[...,:3]
        if opt=='A':   # lighter warm wood with a soft top-left highlight
            base=np.array([150,98,52.]);dark=np.array([92,56,28.]);sh=radial(size,e,-.25,-.3,1.25)[...,None]
            col=dark+(base-dark)*sh;hl=radial(size,e,-.35,-.4,.45)[...,None]*np.array([255,214,150.])*.85
            new=np.clip(col*(1-radial(size,e,-.35,-.4,.45)[...,None]*.85)+hl,0,255)
            rim=np.array(emask(size,e,1)).astype(float)/255-np.array(emask(size,(e[0],e[1],e[2]-3,e[3]-3))).astype(float)/255
            new=new*(1-rim[...,None])+np.array([60,34,14.])*rim[...,None]
            rgb[:]=rgb*(1-m3)+new*m3
        if opt=='B':   # keep the original face, add a gold rim and lift it
            lift=np.clip(rgb*1.6+18,0,255);rgb[:]=rgb*(1-m3)+lift*m3
            rim=(np.array(emask(size,e,2)).astype(float)-np.array(emask(size,(e[0],e[1],e[2]-2,e[3]-2))).astype(float))/255
            rgb[:]=rgb*(1-rim[...,None])+np.array([232,184,74.])*rim[...,None]
        if opt=='C':   # golden like the trunk highlights, glossy spot
            dark=np.array([120,72,30.]);light=np.array([226,168,92.]);sh=radial(size,e,-.3,-.35,1.3)[...,None]
            col=dark+(light-dark)*sh;spot=radial(size,e,-.38,-.45,.32)[...,None]
            new=col*(1-spot)+np.array([255,236,200.])*spot
            rim=np.array(emask(size,e,1)).astype(float)/255-np.array(emask(size,(e[0],e[1],e[2]-3,e[3]-3))).astype(float)/255
            new=new*(1-rim[...,None])+np.array([70,40,16.])*rim[...,None]
            rgb[:]=rgb*(1-m3)+new*m3
        a[...,3]=np.maximum(a[...,3],m*255)
    return Image.fromarray(np.clip(a,0,255).astype('uint8'))
if __name__=='__main__':
    for opt in 'ABC':
        im=Image.open(f'{S}/splash2-branches.png').convert('RGBA');t=treat(im,HEADS['splash2'],opt)
        bg=Image.new('RGBA',im.size,(22,22,22,255));bg.alpha_composite(t);w,h=im.size
        bg.crop((int(w*.22),int(h*.38),int(w*.78),int(h*.82))).resize((700,550)).save(f'{S}/heads-{opt}.png')
