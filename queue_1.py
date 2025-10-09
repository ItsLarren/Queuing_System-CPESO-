import random
from collections import deque

class Task:
    def __init__(self, id, arrival_time):
        self.id = id
        self.arrival_time = arrival_time
        self.service_start_time = None
        self.service_time = None

class Server:
    def __init__(self):
        self.current_task = None
        self.busy_until = 5 

    def is_busy(self, current_time):
        return self.busy_until > current_time

    def start_service(self, task, current_time, service_time):
        self.current_task = task
        self.busy_until = current_time + service_time
        task.service_start_time = current_time
        task.service_time = service_time

class Simulation:
    def __init__(self):
        self.queue = deque()
        self.server = Server()
        self.time = 0  
        self.tasks_completed = []

    def run(self, num_hours, avg_arrival_rate, avg_service_time):
        total_time = num_hours * 60  
        task_id = 1

        for current_minute in range(total_time):

            if random.expovariate(1.0 / avg_arrival_rate) < 1:
                new_task = Task(task_id, current_minute)
                self.queue.append(new_task)
                print(f"Time {current_minute}: Task {task_id} arrived.")
                task_id += 1


            if (not self.server.is_busy(current_minute)) and self.queue:
                next_task = self.queue.popleft()

                service_duration = random.expovariate(1.0 / avg_service_time)
                self.server.start_service(next_task, current_minute, service_duration)
                print(f"Time {current_minute}: Server started Task {next_task.id} (will take {service_duration:.2f} mins).")

            if self.server.is_busy(current_minute) and current_minute >= self.server.busy_until:
                finished_task = self.server.current_task
                self.tasks_completed.append(finished_task)
                print(f"Time {current_minute}: Task {finished_task.id} completed.")
                self.server.current_task = None

        print("\n--- Simulation Finished ---")
        print(f"Tasks Completed: {len(self.tasks_completed)}")
        print(f"Tasks Left in Queue: {len(self.queue)}")
        if self.tasks_completed:
            wait_times = [t.service_start_time - t.arrival_time for t in self.tasks_completed]
            print(f"Average Wait Time: {sum(wait_times)/len(wait_times):.2f} minutes")

sim = Simulation()
sim.run(num_hours=8, avg_arrival_rate=5, avg_service_time=4)