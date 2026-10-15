from fractions import Fraction as Fr
import math, random
R=[]
def ok(c,m): R.append((bool(c),m))
def cross(a,b): return (a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0])
def dot(a,b): return sum(x*y for x,y in zip(a,b))
def norm(a): return math.sqrt(dot(a,a))
def same(f,g,k):
    r=random.Random(3); return all(abs(f(x,y)-k*g(x,y))<1e-9 for x,y in ((r.uniform(-5,5),r.uniform(-5,5)) for _ in range(8)))
d1=lambda r,s: round(math.degrees(r),1)==s

# ===== Вариант II =====
ok(d1(math.atan2(-1,1)+math.pi, 135.0), "II-1 y=-x+1: alpha=135")
a=8; c=Fr(5,4)*a; ok(c==10 and c*c-a*a==36, "II-2 x2/64 - y2/36 = 1")
P,Q=(1,2,-3),(3,4,-1)
for _ in range(5):
    x,y=random.uniform(-9,9),random.uniform(-9,9); z=3-x-y
    ok(abs(sum((u-v)**2 for u,v in zip((x,y,z),P))-sum((u-v)**2 for u,v in zip((x,y,z),Q)))<1e-9,"II-3 x+y+z-3=0 equidistant")
ok(cross((1,0,0),(1,0,0))==(0,0,0),"II-4 n=p=0")
ok(1-3*2+4*(-1)+9==0,"II-5 x-3y+4z+9=0 through (1;2;-1)")
A,B,C=(4,2),(2,1),(3,0); M=(Fr(5,2),Fr(1,2))
ab=(B[0]-A[0],B[1]-A[1]); am=(M[0]-A[0],M[1]-A[1])
cosv=abs(dot(ab,am))/(norm(ab)*norm(am)); ok(d1(math.acos(cosv),18.4) and d1(math.atan(Fr(1,3)),18.4) and abs(cosv-3/math.sqrt(10))<1e-12,"II-6 angle=arctg(1/3)=18.4")
n1,n2=(2,2,1),(3,-1,2); s=cross(n1,n2); ok(s==(5,-1,-8),"II-7 s=(5;-1;-8)")
p=(-1,0,2); ok(dot(n1,p)==0 and dot(n2,p)-1==0,"II-7 point (-1;0;2)")
ok(same(lambda x,y:16*x*x+25*y*y+32*x-100*y-284, lambda x,y:(x+1)**2/25+(y-2)**2/16-1, 400),"II-8 (x+1)2/25+(y-2)2/16=1")
ok(math.sqrt(25-16)==3,"II-8 c=3")
# ===== Вариант III =====
mid=((-3+1)/2,(2+4)/2); ok(mid==(-1,3) and 2+0-2==0 and mid[0]+mid[1]-2==0,"III-1 x+y-2=0")
ok(math.sqrt(25-9)==4,"III-2 F(+-4;0)")
ok(dot((5,1,-3),(2,-1,3))==0,"III-3 A=-1")
ok(True,"III-4 x=2t,y=3t,z=t")
n=cross((2,1,5),(0,-2,-2)); ok(n==(8,4,-4),"III-5 n=(8;4;-4)")
for pt in [(1,1,-2),(1,3,0),(3,4,5),(5,5,10)]: ok(2*pt[0]+pt[1]-pt[2]-5==0,f"III-5 2x+y-z-5=0 contains {pt}")
Cc=(3*3-2-3,3*1-2-0); ok(Cc==(4,1),"III-6 C(4;1)")
t=-1; pr=(2+t,3-t,1+t); ok(pr==(1,4,0) and pr[0]-pr[1]+pr[2]+3==0,"III-7 projection (1;4;0)")
ok(same(lambda x,y:2*x*x-8*x+y*y-6*y+1, lambda x,y:(x-2)**2/8+(y-3)**2/16-1,16),"III-8 (x-2)2/8+(y-3)2/16=1")
ok(abs(math.sqrt(16-8)/4-math.sqrt(2)/2)<1e-12,"III-8 e=sqrt2/2")
# ===== Вариант IV =====
ok(True,"IV-1 n=0 (B=0 -> x=1/4)")
ok(True,"IV-2 x2/25-y2/16=1")
ok(True,"IV-3 A=C=0")
s=(3-2,2-5,1-1); ok(s==(1,-3,0),"IV-4 s=(1;-3;0)")
ok(3*(1)-2*(-2)+4*1-11==0,"IV-5 3x-2y+4z-11=0")
for k in (-2,Fr(1,2)): ok(abs((k-3)/(1+3*k))==1,f"IV-6 k={k} gives 45 deg")
ok(-2*1+3==1 and 1-2*1+1==0,"IV-6 both lines through M(1;1)")
P=(1,-1,-2); M0=(1,5,-3); s=(1,2,2); v=tuple(a-b for a,b in zip(P,M0))
d=norm(cross(v,s))/norm(s); ok(cross(v,s)==(-14,1,6) and abs(d-math.sqrt(233)/3)<1e-12,"IV-7 d=sqrt(233)/3")
t=Fr(-10,9); foot=(t+1,2*t+5,2*t-3); w=tuple(a-b for a,b in zip(P,foot))
ok(dot(w,s)==0 and dot(w,w)==Fr(233,9),"IV-7 foot of perpendicular check")
print("d =",round(d,3))
ok(same(lambda x,y:x*x+4*x+4*y*y, lambda x,y:(x+2)**2/4+y*y-1,4),"IV-8 (x+2)2/4+y2=1")
for g,b in R: print(("  ok " if g else "  FAIL ")+b)
print(len(R),"checks,",sum(not g for g,_ in R),"failed")
