// This script adapts the direction of the monster
// when it comes at a possible crossing
{
  if(hspeed == 0){
    if(random(3)<1 && place_free(x-argument0,y)){
        hspeed = -argument0;
        vspeed = 0;
    }
    if(random(3)<1 && place_free(x+argument0,y)){
        hspeed = argument0;
        vspeed = 0;
    }
  }else{
    if(random(3)<1 && place_free(x,y-argument0)){
        hspeed = 0;
        vspeed = -argument0;
    }
    if(random(3)<1 && place_free(x,y+argument0)){
        hspeed = 0;
        vspeed = argument0;
    }
  }
    while(hspeed == 0 && vspeed == 0){
        if(random(3)<1 && place_free(x-argument0,y)){
        hspeed = -argument0;
        vspeed = 0;
    }
    if(random(3)<1 && place_free(x+argument0,y)){
        hspeed = argument0;
        vspeed = 0;
    }
    if(random(3)<1 && place_free(x,y-argument0)){
        hspeed = 0;
        vspeed = -argument0;
    }
    if(random(3)<1 && place_free(x,y+argument0)){
        hspeed = 0;
        vspeed = argument0;
    }
    }
}
