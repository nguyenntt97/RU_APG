{
  if(hspeed == 0){
    if(random(3)< 1 && place_free(x - argument0 / 2, y)){
        hspeed = - argument0 / 2;
        vspeed = 0;
    }
    if(random(3)< 1 && place_free(x + argument0 / 2, y)){
        hspeed = argument0 / 2;
        vspeed = 0;
    }
  }else{
    if(random(3)< 1 && place_free(x, y - argument0 / 2)){
        hspeed = 0;
        vspeed = - argument0 / 2;
    }
    if(random(3)< 1 && place_free(x,y + argument0 / 2)){
        hspeed = 0;
        vspeed = argument0 / 2;
    }
  }
    while(hspeed == 0 && vspeed == 0){
        if(random(3)<1 && place_free(x - argument0 / 2,y)){
        hspeed = -argument0 / 2;
        vspeed = 0;
    }
    if(random(3)<1 && place_free(x + argument0 / 2,y)){
        hspeed = argument0 / 2;
        vspeed = 0;
    }
    if(random(3)<1 && place_free(x,y - argument0 / 2)){
        hspeed = 0;
        vspeed = -argument0 / 2;
    }
    if(random(3)<1 && place_free(x,y + argument0 / 2)){
        hspeed = 0;
        vspeed = argument0 / 2;
    }
    }
}
