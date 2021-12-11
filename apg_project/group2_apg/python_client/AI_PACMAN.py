import cv2
import numpy as np 
import math
import yaml


def round_up(n, decimals=0):
    multiplier = 10 ** decimals
    return math.ceil(n * multiplier) / multiplier

def gen_biMAP(img):
	grid = 15 
	asize,_,_ = img.shape
	asize = int(asize/grid)
	biMAP = np.zeros((grid,grid))
	wall = img[:asize, :asize,:]

	for i in range(grid):
		for j in range(grid):
				cell = img[i*asize:(i+1)*asize,j*asize:(j+1)*asize,:]
				dst = sum(sum(sum(wall - cell)))
				if dst < 5:
					biMAP[i,j] = 1
	return biMAP, asize


class AI_PACMAN(object):
	def __init__(self):
		with open('init.yaml') as file:
			data = yaml.load(file, Loader=yaml.FullLoader)
		self.bot1 = data['bot1']
		self.bot2 = data['bot2']
		self.bot3 = data['bot3']
		self.bot4 = data['bot4']
		self.pacman = data['pacman']
		init_img = cv2.imread(data['init_img'])
		self.__biMAP, self.__asize = gen_biMAP(init_img)

	def __update_position(self, frame):
		self.p1 = self.__get_position(frame, self.bot1)
		self.p2 = self.__get_position(frame, self.bot2)
		# self.p3 = self.__get_position(frame, self.bot3)
		self.p4 = self.__get_position(frame, self.bot4)
		self.pp = self.__get_position(frame, self.pacman)
	
	def __exist_wall(self, p1, p2):
		p = [int((p1[0]+p2[0])/2), int((p1[1] + p2[1])/2)]
		if self.__biMAP[p[0], p[1]] == 1:
			print("________________________________________________________________")
			return 1
		else:
			return 0

	def __cal_dis(self, p1, p2):
		return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)

	def __fitness(self, pp):
		temp_p = [self.p1, self.p2, self.p4]
		d1 = 0.5 if self.p1 == 0 else self.__cal_dis(self.p1, pp)
		d2 = 0.5 if self.p2 == 0 else self.__cal_dis(self.p2, pp)
		# d3 = 1 if self.p3 == 0 else self.__cal_dis(self.p3, pp)
		d4 = 0.5 if self.p4 == 0 else self.__cal_dis(self.p4, pp)
		temp_d = [d1, d2, d4]
		index = np.argmin(temp_d)

		if temp_d[index] >= 1 and temp_d[index] < 2.5:
			return temp_d[index] + 1*self.__exist_wall(temp_p[index], pp)
		else:
			return temp_d[index]

	
	def __get_position(self, img, color):
		# based on this: https://techvidvan.com/tutorials/detect-objects-of-similar-color-using-opencv-in-python/
		# convert to hsv colorspace
		hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
		# lower bound and upper bound for Green color
		lower_bound = np.array(color[0])   
		upper_bound = np.array(color[1])
		# find the colors within the boundaries
		mask = cv2.inRange(hsv, lower_bound, upper_bound)
		#define kernel size  
		kernel = np.ones((7,7),np.uint8)
		# Remove unnecessary noise from mask
		mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
		mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
		# Segment only the detected region
		segmented_img = cv2.bitwise_and(img, img, mask=mask)
		contours, hierarchy = cv2.findContours(mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
		if contours == ():
			return 0
		position = [int(round_up(np.mean(contours[0][:,0,1])/self.__asize+0.2))-1, int(round_up(np.mean(contours[0][:,0,0])/self.__asize+0.2))-1]
		return position


	def __posibile_moves(self, frame):
		self.__update_position(frame)
		out = {}
		if self.__biMAP[self.pp[0], self.pp[1]+1] == 0:
			out['right'] = (self.pp[0], self.pp[1]+1)
		if self.__biMAP[self.pp[0], self.pp[1]-1] == 0:
			out['left'] = (self.pp[0], self.pp[1]-1)
		if self.__biMAP[self.pp[0]+1, self.pp[1]] == 0:
			out['down'] = (self.pp[0]+1, self.pp[1])
		if self.__biMAP[self.pp[0]-1, self.pp[1]] == 0:
			out['up'] = (self.pp[0]-1, self.pp[1])
		return out

	def __next_move(self, frame):
		pop = self.__posibile_moves(frame)
		length = len(pop)
		if length < 1:
			raise
		if length == 1:
			return list(pop)[0]
		else:
			fitnesses = []
			pos_moves = list(pop)
			for k,d in pop.items():
				fitnesses.append(self.__fitness(d))
			index = np.argmax(fitnesses)
			return pos_moves[index]

	def run(self, frame):
		return self.__next_move(frame)


if __name__ == '__main__':
	# for testing 
	path = 'test.png'
	img = cv2.imread(path)
	a = AI_PACMAN()
	a.run(img)
