import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RiderService } from './rider.service';
import { CreateRiderDto } from './dto/create-rider.dto';
import { UpdateRiderDto } from './dto/update-rider.dto';

@Controller('enatega-delivery-integration/rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  create(@Body() createRiderDto: CreateRiderDto) {
    return this.riderService.create(createRiderDto);
  }

  @Get()
  findAll() {
    return this.riderService.findAll();
  }

  @Get('my-jobs')
  findMyJobs(@Param('riderId') riderId: string) {
    // Note: In a real app, riderId would come from the JWT user object
    return this.riderService.findMyJobs(riderId);
  }

  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.riderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRiderDto: UpdateRiderDto) {
    return this.riderService.update(id, updateRiderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.riderService.remove(id);
  }
}
