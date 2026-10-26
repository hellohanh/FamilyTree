"""Entry 88: leaves-only splash images (falling leaves are cut from these, so no branch rides along)."""
from PIL import Image
import numpy as np
from scipy import ndimage as nd
import sys
out=sys.argv[1] if len(sys.argv)>1 else None
for n in ['splash1','splash2']:
    a=np.array(Image.open('assets/'+n+'-v2.webp').convert('RGBA')).astype(float)
    br=np.array(Image.open('assets/'+n+'-v2-branches.webp').convert('RGBA'))[...,3]>20
    r,g,b,al=a[...,0],a[...,1],a[...,2],a[...,3]
    mx=np.maximum(np.maximum(r,g),b);mn=np.minimum(np.minimum(r,g),b);s=(mx-mn)/(mx+1e-6)
    hue=(((g-b)/(mx-mn+1e-6))%6)*60
    redhue=(mx==r)&((hue<22)|(hue>330))
    leaf=(al>0)&redhue&(s>.55)&(mx>70)
    m=leaf&~nd.binary_dilation(br,iterations=3)   # leaf colour only: twigs and dark outlines stay behind
    lab,k=nd.label(m);sz=nd.sum(np.ones_like(lab),lab,range(1,k+1));keep=np.zeros(k+1,bool);keep[1:]=sz>=30;m=keep[lab]
    t=a.copy();t[~m]=0
    Image.fromarray(t.astype('uint8')).save('assets/'+n+'-v2-leaves.webp',quality=90,method=6)
    if out:
        bg=Image.new('RGBA',(a.shape[1],a.shape[0]),(22,22,22,255));bg.alpha_composite(Image.fromarray(t.astype('uint8')))
        w,h=bg.size;bg.crop((int(w*.1),int(h*.15),int(w*.6),int(h*.55))).resize((600,480)).save(out+'/leaves-'+n+'.png')
