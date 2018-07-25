'use strict';var names=require('./colorUtils').allColors,ntc={init:function init(){for(var a,b,c,d=0;d<ntc.names.length;d++)a='#'+ntc.names[d][0],b=ntc.rgb(a),c=ntc.hsl(a),ntc.names[d].push(b[0],b[1],b[2],c[0],c[1],c[2])},name:function name(a){var c=Math.pow;if(a=a.toUpperCase(),3>a.length||7<a.length)return['#000000','Invalid Color: '+a,!1];0==a.length%3&&(a='#'+a),4==a.length&&(a='#'+a.substr(1,1)+a.substr(1,1)+a.substr(2,1)+a.substr(2,1)+a.substr(3,1)+a.substr(3,1));for(var d=ntc.rgb(a),e=d[0],f=d[1],g=d[2],b=ntc.hsl(a),j=b[0],h=b[1],k=b[2],l=0,m=0,n=0,o=-1,p=-1,q=0;q<ntc.names.length;q++){if(a=='#'+ntc.names[q][0])return['#'+ntc.names[q][0],ntc.names[q][1],!0];l=c(e-ntc.names[q][2],2)+c(f-ntc.names[q][3],2)+c(g-ntc.names[q][4],2),m=c(j-ntc.names[q][5],2)+c(h-ntc.names[q][6],2)+c(k-ntc.names[q][7],2),n=l+2*m,(0>p||p>n)&&(p=n,o=q)}return 0>o?['#000000','Invalid Color: '+a,!1]:['#'+ntc.names[o][0],ntc.names[o][1],!1]},hsl:function hsl(a){var c,d,e,f,h,i,j=Math.max,k=Math.min,l=[parseInt('0x'+a.substring(1,3))/255,parseInt('0x'+a.substring(3,5))/255,parseInt('0x'+a.substring(5,7))/255],m=l[0],n=l[1],g=l[2];return c=k(m,k(n,g)),d=j(m,j(n,g)),e=d-c,i=(c+d)/2,h=0,0<i&&1>i&&(h=e/(0.5>i?2*i:2-2*i)),f=0,0<e&&(d==m&&d!=n&&(f+=(n-g)/e),d==n&&d!=g&&(f+=2+(g-m)/e),d==g&&d!=m&&(f+=4+(m-n)/e),f/=6),[parseInt(255*f),parseInt(255*h),parseInt(255*i)]},rgb:function rgb(a){return[parseInt('0x'+a.substring(1,3)),parseInt('0x'+a.substring(3,5)),parseInt('0x'+a.substring(5,7))]},names:names};module.exports=ntc;