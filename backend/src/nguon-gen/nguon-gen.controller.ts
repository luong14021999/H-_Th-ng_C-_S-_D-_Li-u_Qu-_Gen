import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { NguonGenService, CreateNguonGenDto, UpdateNguonGenDto } from './nguon-gen.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('nguon-gen')
export class NguonGenController {
  constructor(private service: NguonGenService) {}

  @Get()
  findAll(@Query('nhom') nhom?: string, @Query('search') search?: string) {
    return this.service.findAll(nhom, search);
  }

  @Get('stats')
  stats() {
    return this.service.stats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateNguonGenDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNguonGenDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
